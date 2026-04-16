import uuid
from datetime import datetime
from models import Payout, Notification


def initiate_payout(claim, user, db):
    txn_id = f"GCS-{uuid.uuid4().hex[:10].upper()}"
    payout = Payout(
        claim_id=claim.id,
        user_id=user.id,
        amount=claim.payout_amount,
        method="UPI",
        txn_id=txn_id,
        status="SUCCESS",
        initiated_at=datetime.utcnow(),
    )
    db.add(payout)
    notification = Notification(
        user_id=user.id,
        type="PAYOUT",
        message=f"₹{claim.payout_amount} credited to {user.upi_id} ✅ Txn: {txn_id}",
        is_read=False,
        created_at=datetime.utcnow(),
    )
    db.add(notification)
    db.commit()
    db.refresh(payout)
    return payout
