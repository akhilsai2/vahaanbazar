export const LOGINURL = {
  LOGIN: "v1/login",
  MOBILE_LOGIN_OTP: "v1/otp-login-request",
  MOBILE_LOGIN: "v1/otp-login",
  FORGET_PASSWORD_OTP: "v1/forgot-password",
  RESET_PASSWORD: "v1/reset-password",
  FORGET_PASSWORD_OTP_RESEND: "v1/forgotpwd-resend-otp",
};

export const REGISTER = {
  REGISTER: "v1/register",
  VERIFY_REGISTER: "v1/verify-otp",
  REGISTER_OTP_RESEND: "v1/resend-otp",
};

export const BIDS = {
  VIEW_BIDS: "v1/admin/bids/get_max_bids",
  BID_APPROVAL : "v1/admin/bids/approve_bid",
  BID_SUBSCRIPTION : "v1/bidlimitsubscriptions",
  VEHICLE_SUBSCRIPTION : "v1/vehicleaccesssubscriptions",
};
 export const USERS = {
  VIEW_USERS_LIST : "v1/admin/users",
  VIEW_USER_PLANS:"v1/bidlimitusersubscriptions"
 }

 export const VEHICLES = {
  VEHICLE_VERFICATION:"v1/admin/vehicles",
  VEHICLE_APPROVAL:"v1/admin/verify-application",
 }
 export const PAYMENT = {
  PAYMENT_HISTORY:"v1/payments",
 }