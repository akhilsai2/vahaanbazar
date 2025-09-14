export const LOGINURL = {
  LOGIN: "v1/auth/login",
  MOBILE_LOGIN_OTP: "v1/auth/otp-login-request",
  MOBILE_LOGIN: "v1/otp-login",
  FORGET_PASSWORD_OTP: "v1/forgot-password/send-otp",
  RESET_PASSWORD: "v1/reset-password",
  FORGET_PASSWORD_OTP_RESEND: "v1/forgotpwd-resend-otp",
};

export const REGISTER = {
  REGISTER: "v1/auth/register",
  VERIFY_REGISTER: "v1/auth/otp-verify",
  REGISTER_OTP_RESEND: "v1/auth/resend-otp",
};

export const BIDS = {
  VIEW_AUCTIONS: "v1/auctions-admin/list-auctions",
  VIEW_VEHICLES:"v1/auctions-admin/auctions/details",
  GET_TOP_BIDS : "v1/auctions-admin/top-bids",
  BID_APPROVAL_PAYMENT : "v1/auctions-admin/update-payment",
  BID_SUBSCRIPTION : "v1/subscription/subscription-listing",
  CREATE_UPDATE_BID_SUBSCRIPTION : "v1/auctions-admin/subscription-plans",
  VEHICLE_SUBSCRIPTION : "v1/vehicleaccesssubscriptions",
  APPROVED_BIDS : "v1/auctions-admin/auction-approved-bids"
};
 export const USERS = {
  VIEW_USERS_LIST : "v1/admin/users",
  VIEW_USER_PLANS:"v1/bidlimitusersubscriptions"
 }

 export const VEHICLES = {
  VEHICLE_VERFICATION:"v1/admin/vehicles",
  VEHICLE_APPROVAL:"v1/admin/verify-application",
  VEHICLE_CATEGORY_IMAGE_UPDATE:"v1/admin/vehicle-sale-categories/",
  CATEGORIES:"v1/vehicle-sale-categories",
  VEHICLEUPDATE:"v1/admin/vehicles/",
  VEHICLEUPLOAD:"v1/vehiclesales"
 }
 export const PAYMENT = {
  PAYMENT_HISTORY:"v1/payments",
 }

 export const BUY_SELL ={
  LIST_VEHICLES : "v1/sell-buy-admin/list-vehicles",
  APPROVE_BUY_SELL : "v1/sell-buy-admin/approve-vehicles",
  LIST_VEHICLES_INTEREST: "v1/sell-buy-admin/vehicle-interests"
 }