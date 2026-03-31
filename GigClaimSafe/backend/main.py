from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import engine, SessionLocal, Base
import models
from risk_calculator import calculate_risk_score, recalculate_user_risk_profile
from fraud_detection import detect_fraud
from disruption_monitor import get_monitor_data
from datetime import datetime
import random

# Create tables
Base.metadata.create_all(bind=engine)

app = Flask(__name__)
CORS(app)

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        pass

def close_db(db):
    db.close()

# ==================== USER ENDPOINTS ====================

@app.route('/register', methods=['POST'])
def register_user():
    """Register a new gig worker and generate risk profile."""
    data = request.get_json()
    db = get_db()
    
    try:
        # Calculate risk score
        risk_score, risk_level = calculate_risk_score(
            data['city'],
            data['weekly_earnings'],
            data['work_hours']
        )
        
        # Create user
        db_user = models.User(
            name=data['name'],
            platform=data['platform'],
            city=data['city'],
            weekly_earnings=data['weekly_earnings'],
            work_hours=data['work_hours'],
            risk_score=risk_score,
            risk_level=risk_level
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return jsonify({
            'id': db_user.id,
            'name': db_user.name,
            'platform': db_user.platform,
            'city': db_user.city,
            'weekly_earnings': db_user.weekly_earnings,
            'work_hours': db_user.work_hours,
            'risk_score': db_user.risk_score,
            'risk_level': db_user.risk_level,
            'created_at': db_user.created_at.isoformat() if db_user.created_at else None
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({'detail': f'Error registering user: {str(e)}'}), 400
    finally:
        close_db(db)

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get user by ID."""
    db = get_db()
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            return jsonify({'detail': 'User not found'}), 404
        
        return jsonify({
            'id': user.id,
            'name': user.name,
            'platform': user.platform,
            'city': user.city,
            'weekly_earnings': user.weekly_earnings,
            'work_hours': user.work_hours,
            'risk_score': user.risk_score,
            'risk_level': user.risk_level,
            'created_at': user.created_at.isoformat() if user.created_at else None
        })
    finally:
        close_db(db)

@app.route('/users', methods=['GET'])
def list_users():
    """List all users."""
    db = get_db()
    try:
        users = db.query(models.User).all()
        return jsonify([{
            'id': user.id,
            'name': user.name,
            'platform': user.platform,
            'city': user.city,
            'weekly_earnings': user.weekly_earnings,
            'risk_score': user.risk_score,
            'risk_level': user.risk_level
        } for user in users])
    finally:
        close_db(db)

# ==================== RISK & PLANS ====================

@app.route('/risk-score/<int:user_id>', methods=['GET'])
def get_risk_score(user_id):
    """Get risk profile."""
    db = get_db()
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            return jsonify({'detail': 'User not found'}), 404
        
        factors = {
            'city': user.city,
            'weekly_earnings': user.weekly_earnings,
            'work_hours': user.work_hours,
            'risk_score': user.risk_score
        }
        
        return jsonify({
            'user_id': user.id,
            'risk_score': user.risk_score,
            'risk_level': user.risk_level,
            'factors': factors
        })
    finally:
        close_db(db)

@app.route('/select-plan', methods=['POST'])
def select_plan():
    """Select insurance plan."""
    data = request.get_json()
    db = get_db()
    
    try:
        user_id = data['user_id']
        plan_type = data['plan_type'].lower()
        
        # Define plan details
        plans = {
            'basic': {'premium': 20, 'coverage': 1000},
            'standard': {'premium': 35, 'coverage': 2000},
            'premium': {'premium': 50, 'coverage': 3500}
        }
        
        if plan_type not in plans:
            return jsonify({'detail': 'Invalid plan type'}), 400
        
        plan_details = plans[plan_type]
        
        # Deactivate existing policies
        db.query(models.Policy).filter(models.Policy.user_id == user_id).update({'is_active': False})
        
        # Create new policy
        policy = models.Policy(
            user_id=user_id,
            plan_type=plan_type,
            coverage_amount=plan_details['coverage'],
            premium=plan_details['premium'],
            is_active=True
        )
        db.add(policy)
        db.commit()
        db.refresh(policy)
        
        return jsonify({
            'id': policy.id,
            'user_id': policy.user_id,
            'plan_type': policy.plan_type,
            'coverage_amount': policy.coverage_amount,
            'premium': policy.premium,
            'is_active': policy.is_active,
            'created_at': policy.created_at.isoformat() if policy.created_at else None
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({'detail': f'Error selecting plan: {str(e)}'}), 400
    finally:
        close_db(db)

@app.route('/policies/<int:user_id>', methods=['GET'])
def get_policies(user_id):
    """Get all policies for user."""
    db = get_db()
    try:
        policies = db.query(models.Policy).filter(models.Policy.user_id == user_id).all()
        return jsonify([{
            'id': p.id,
            'user_id': p.user_id,
            'plan_type': p.plan_type,
            'coverage_amount': p.coverage_amount,
            'premium': p.premium,
            'is_active': p.is_active
        } for p in policies])
    finally:
        close_db(db)

@app.route('/policies/<int:user_id>/active', methods=['GET'])
def get_active_policy(user_id):
    """Get active policy."""
    db = get_db()
    try:
        policy = db.query(models.Policy).filter(
            models.Policy.user_id == user_id,
            models.Policy.is_active == True
        ).first()
        
        if not policy:
            return jsonify({'detail': 'No active policy'}), 404
        
        return jsonify({
            'id': policy.id,
            'user_id': policy.user_id,
            'plan_type': policy.plan_type,
            'coverage_amount': policy.coverage_amount,
            'premium': policy.premium
        })
    finally:
        close_db(db)

# ==================== MONITORING & CLAIMS ====================

@app.route('/monitor/<city>', methods=['GET'])
def get_monitor(city):
    """Get monitor data for a city."""
    try:
        data = get_monitor_data(city)
        return jsonify(data)
    except Exception as e:
        return jsonify({'detail': str(e)}), 400

@app.route('/monitor-all', methods=['GET'])
def get_monitor_all():
    """Get monitor data for all major cities."""
    cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad']
    try:
        results = {}
        for city in cities:
            results[city] = get_monitor_data(city)
        return jsonify(results)
    except Exception as e:
        return jsonify({'detail': str(e)}), 400

@app.route('/trigger-claim', methods=['POST'])
def trigger_claim():
    """Create and process a claim."""
    data = request.get_json()
    db = get_db()
    
    try:
        user_id = data['user_id']
        trigger_reason = data.get('trigger_reason', 'disruption')
        
        # Get active policy
        policy = db.query(models.Policy).filter(
            models.Policy.user_id == user_id,
            models.Policy.is_active == True
        ).first()
        
        if not policy:
            return jsonify({'detail': 'No active policy found'}), 404
        
        # Get user info
        user = db.query(models.User).filter(models.User.id == user_id).first()
        
        # Detect fraud
        fraud_score = detect_fraud(user_id, db, trigger_reason, user.city if user else 'Unknown')
        is_fraud = fraud_score > 0.4
        
        # Calculate payout
        payout_amount = policy.coverage_amount if not is_fraud else 0
        
        # Create claim
        claim = models.Claim(
            user_id=user_id,
            policy_id=policy.id,
            status='approved',
            trigger_reason=trigger_reason,
            payout_amount=payout_amount,
            fraud_flag=is_fraud,
            fraud_score=fraud_score,
            location_at_claim='Auto-detected'
        )
        db.add(claim)
        db.commit()
        db.refresh(claim)
        
        # Create payout if not fraud
        if not is_fraud:
            payout = models.Payout(
                claim_id=claim.id,
                user_id=user_id,
                amount=payout_amount,
                status='completed'
            )
            db.add(payout)
            db.commit()
        
        return jsonify({
            'id': claim.id,
            'user_id': claim.user_id,
            'status': claim.status,
            'payout_amount': claim.payout_amount,
            'fraud_flag': claim.fraud_flag,
            'fraud_score': claim.fraud_score
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({'detail': f'Error creating claim: {str(e)}'}), 400
    finally:
        close_db(db)

@app.route('/claims/<int:user_id>', methods=['GET'])
def get_claims(user_id):
    """Get all claims for user."""
    db = get_db()
    try:
        claims = db.query(models.Claim).filter(models.Claim.user_id == user_id).all()
        return jsonify([{
            'id': c.id,
            'user_id': c.user_id,
            'status': c.status,
            'trigger_reason': c.trigger_reason,
            'payout_amount': c.payout_amount,
            'fraud_flag': c.fraud_flag,
            'created_at': c.created_at.isoformat() if c.created_at else None
        } for c in claims])
    finally:
        close_db(db)

@app.route('/claims/<int:user_id>/recent', methods=['GET'])
def get_recent_claims(user_id):
    """Get recent claims."""
    db = get_db()
    try:
        claims = db.query(models.Claim).filter(
            models.Claim.user_id == user_id
        ).order_by(models.Claim.created_at.desc()).limit(5).all()
        
        return jsonify([{
            'id': c.id,
            'status': c.status,
            'payout_amount': c.payout_amount,
            'fraud_flag': c.fraud_flag,
            'created_at': c.created_at.isoformat() if c.created_at else None
        } for c in claims])
    finally:
        close_db(db)

@app.route('/claims/<int:claim_id>/approve', methods=['POST'])
def approve_claim(claim_id):
    """Approve a claim."""
    db = get_db()
    try:
        claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
        if not claim:
            return jsonify({'detail': 'Claim not found'}), 404
        
        claim.status = 'approved'
        db.commit()
        db.refresh(claim)
        
        return jsonify({
            'id': claim.id,
            'user_id': claim.user_id,
            'status': claim.status,
            'payout_amount': claim.payout_amount,
            'fraud_flag': claim.fraud_flag,
            'fraud_score': claim.fraud_score,
            'trigger_reason': claim.trigger_reason,
            'created_at': claim.created_at.isoformat() if claim.created_at else None
        })
    except Exception as e:
        db.rollback()
        return jsonify({'detail': str(e)}), 400
    finally:
        close_db(db)

# ==================== PAYOUTS & ADMIN ====================

@app.route('/payouts/<int:user_id>', methods=['GET'])
def get_payouts(user_id):
    """Get all payouts for user."""
    db = get_db()
    try:
        payouts = db.query(models.Payout).filter(models.Payout.user_id == user_id).all()
        return jsonify([{
            'id': p.id,
            'claim_id': p.claim_id,
            'amount': p.amount,
            'status': p.status,
            'created_at': p.created_at.isoformat() if p.created_at else None
        } for p in payouts])
    finally:
        close_db(db)

@app.route('/payouts/total/<int:user_id>', methods=['GET'])
def get_total_payouts(user_id):
    """Get total payout amount for user."""
    db = get_db()
    try:
        total = db.query(func.sum(models.Payout.amount)).filter(
            models.Payout.user_id == user_id,
            models.Payout.status == 'completed'
        ).scalar() or 0
        
        return jsonify({'user_id': user_id, 'total_payout': total})
    finally:
        close_db(db)

@app.route('/admin/dashboard', methods=['GET'])
def admin_dashboard():
    """Get admin dashboard stats."""
    db = get_db()
    try:
        total_users = db.query(func.count(models.User.id)).scalar()
        total_claims = db.query(func.count(models.Claim.id)).scalar()
        approved_claims = db.query(func.count(models.Claim.id)).filter(
            models.Claim.status == 'approved'
        ).scalar()
        total_payouts = db.query(func.sum(models.Payout.amount)).scalar() or 0
        fraud_claims = db.query(func.count(models.Claim.id)).filter(
            models.Claim.fraud_flag == True
        ).scalar()
        
        return jsonify({
            'total_users': total_users,
            'total_claims': total_claims,
            'approved_claims': approved_claims,
            'total_payouts': total_payouts,
            'fraud_claims': fraud_claims
        })
    finally:
        close_db(db)

@app.route('/admin/claims-by-status', methods=['GET'])
def admin_claims_by_status():
    """Get claims breakdown by status."""
    db = get_db()
    try:
        pending = db.query(func.count(models.Claim.id)).filter(
            models.Claim.status == 'pending'
        ).scalar()
        approved = db.query(func.count(models.Claim.id)).filter(
            models.Claim.status == 'approved'
        ).scalar()
        paid = db.query(func.count(models.Claim.id)).filter(
            models.Claim.status == 'paid'
        ).scalar()
        
        return jsonify({
            'pending': pending,
            'approved': approved,
            'paid': paid
        })
    finally:
        close_db(db)

@app.route('/admin/fraud-flagged', methods=['GET'])
def admin_fraud_flagged():
    """Get fraud flagged claims."""
    db = get_db()
    try:
        claims = db.query(models.Claim).filter(
            models.Claim.fraud_flag == True
        ).all()
        
        return jsonify([{
            'id': c.id,
            'user_id': c.user_id,
            'fraud_score': c.fraud_score,
            'created_at': c.created_at.isoformat() if c.created_at else None
        } for c in claims])
    finally:
        close_db(db)

# Health check endpoint
@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
