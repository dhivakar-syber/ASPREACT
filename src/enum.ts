export enum EnumMovementType
{
    Inward = 0, // 101
    Return = 1   // 102
}
export enum EnumCurrency
{
    INR = 0,
    USD = 1,
}
export enum EnumTransaction
{
    Credit = 0,
    Debit = 1,
}

export enum DocumentStatus
{ 
    NotStarted=0,
    Pending=1,
    Approved=2,
    Rejected=3,
    Resubmit=4

}
export enum SupplementaryStatus
{
    NotStarted = 0,
    Approved = 2,
    Rejected = 3,
    BuyerPending = 10,
    BuyerApproved = 11,
    BuyerRejected = 12,
    AccountsPending = 20,
    AccountsApproved = 21,
    AccountsRejected = 22,
    PaymentPending = 30,
    PaymentApproved = 31,
    PaymentRejected = 32
    


}

export enum EnumUnitOfMeasurment
{ 
 ZEC=0

}

export enum EnumDisputeStatus
{
    Open=0,
    ForwardedToFandC=1,
    Close=2,
    InimatedToBuyer=3
}
export enum EnumRoleType
{
   NotPartOfOrganization=0,
   Internal =1,
   External =2
}