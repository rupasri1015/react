let baseUrlCC = '';
let baseUrlInspection = '';
let SPMUrlCC = '';
let PaymentUrl = '';
let RAZORPAY_ID = '';


/*
if (process.env.NODE_ENV === 'development') {
  baseUrlCC = 'http://dev.api.credr.com:8080';
  baseUrlInspection = 'http://dev.api.credr.com:8081';
  //baseUrlInspection = 'http://192.168.2.39:8081'
  SPMUrlCC = 'http://dev.api.credr.com:8086';
  PaymentUrl = 'http://dev.api.credr.com:9085'
  RAZORPAY_ID = 'rzp_test_NSit0sRQqaEPXw'
} else if (process.env.NODE_ENV === 'production') {
  // baseUrlCC = 'http://apiv2.credr.com:8080';
  // baseUrlInspection = 'http://inspectionapi.credr.com:8081';
  // SPMUrlCC = 'http://13.126.251.161:8086';
  // PaymentUrl = 'http://apiv2.credr.com:9085'
  baseUrlCC = 'https://prodapi.credr.com:8080';
  baseUrlInspection = 'https://prodapi.credr.com:8081';
  SPMUrlCC = 'https://prodapi.credr.com:8086';
  PaymentUrl = 'https://prodapi.credr.com:9085'
  RAZORPAY_ID = 'rzp_live_NSByPicxepheoL'
}
*/


if (process.env.NODE_ENV === 'development') {
  baseUrlCC = 'http://devapi.credr.com:' + '8080';
  baseUrlInspection = 'http://devapi.credr.com:' + '8081';
  SPMUrlCC = 'http://devapi.credr.com:' + '8086';
  PaymentUrl = 'http://devapi.credr.com:' + '9085';

  RAZORPAY_ID = 'rzp_test_NSit0sRQqaEPXw';
} else {
  baseUrlCC = process.env.REACT_APP_API_URL + '8080';
  baseUrlInspection = process.env.REACT_APP_API_URL + '8081';
  SPMUrlCC = process.env.REACT_APP_API_URL + '8086';
  PaymentUrl = process.env.REACT_APP_API_URL + '9085';

  RAZORPAY_ID = process.env.REACT_APP_RAZORPAY_ID;
}
export const API_ENDPOINTS = {
  AUTHENTICATION: {
    LOGIN: `${baseUrlCC}/crm/v1/login`,
  },
  STORE_DETAILS: {
    STORE_ADDRESS: `${baseUrlCC}/crm/store/address/<STORE_ID>`,
  },
  BIDDING: {
    GET_BIDDING_LIST: `${baseUrlCC}/pro/v1/getBiddingList`,
    EXPORT_TO_EXEL: `${baseUrlCC}/pro/v1/exportToExcel`,
    GET_BIDDING_DETAILS: `${baseUrlCC}/pro/v1/getBiddingInfo/<LEAD_ID>`,
    MARK_AS_DROP: `${baseUrlCC}/pro/v1/update/leadstatus`,
    UPDATE_REGISTRATION_NUMBER: `${baseUrlInspection}/inspection/v1/update/registration`,
    GET_LEAD_DETAILS: `${baseUrlCC}/pro/v1/leadDetails/<LEAD_ID>`,
    GET_USER_DETAILS: `${baseUrlCC}/pro/v1/getUserDetails/<LEAD_ID>`,
    GET_VEHICLE_DETAILS: `${baseUrlCC}/pro/v1/vehicledetails/<INVENTORY_ID>`,
    GET_VALUATOR_DETAILS: `${baseUrlCC}/pro/v1/getValuatorDetails/<STORE_ID>/<VALUATOR_ID>`,
    RE_BID: `${baseUrlCC}/auction/v1/storeRebid`,
    SHD_RE_BID: `${baseUrlCC}/auction/v1/rebid`,
    CALL_TO_CUSTOMER: `${baseUrlCC}/crm/voicecall`,
    UPDATE_BID_AMT: `${baseUrlCC}/pro/update/biddingAmount`,
    REBID_OTP:`${baseUrlCC}/centralValuation/otp/<M_NUMBER>/<REG_NO>`,
    REBID_OTP_VERIFY:`${baseUrlCC}/centralValuation/rebid/otp/validate/<M_NUMBER>/<OTP>`,
    GET_LEAD_LIFECYCLE_DETAILS: `${baseUrlCC}/pro/lifeCycle/<LEAD_ID>`,
    OVERRIDE_TO_STORE: `${baseUrlCC}/auction/override`,
    RELEASE_AUTHORIZARTION:`${baseUrlCC}/auction/release/<LEAD_ID>`,
    UPDATE_RELEASE_AUTH:`${baseUrlCC}/auction/release/auth`
  },
  FHD: {
    GET_USER_LIST: `${baseUrlCC}/pro/v1/getUserList`,
    SEARCH_FHD_USER: `${baseUrlCC}/pro/v1/getUserList`,
    ADD_USER: `${baseUrlCC}/pro/v1/add/user`,
    UPDATE_USER: `${baseUrlCC}/pro/v1/edit/user`,
    ADD_FHD: `${baseUrlCC}/pro/newOEM/onBoard`,
    GET_FHD_DETAILS: `${baseUrlCC}/pro/fhdinfo`,
  },
  SHD: {
    GET_USER_LIST: `${baseUrlCC}/pro/v1/getUserList`,
    SEARCH_SHD_USER: `${baseUrlCC}/pro/v1/getUserList`,
    ADD_USER: `${baseUrlCC}/pro/v1/add/user`,
    UPDATE_USER: `${baseUrlCC}/pro/v1/edit/user`,
    ADD_SHD: `${baseUrlCC}/pro/newOEM/onBoard`,
    SHD_COMMISSION: `${baseUrlCC}/auction/shd/list`,
    GET_ORDER_DEDUCTIONS: `${baseUrlCC}/auction/orderDeductions/<ORDER_ID>`,
    ADD_SHD_COMMISSION: `${baseUrlCC}/auction/add/commission`,
    GET_SHD_DETAILS: `${baseUrlCC}/auction/shdinfo/<TRANSACTION_ID>`,
    CARE_CONFIRMATION_LIST: `${baseUrlCC}/centralValuation/customer/list`,
    UPDATE_STATUS_QUOTE: `${baseUrlCC}/centralValuation/quoteUpdate/statusCall`,
    GET_REASONS_QUOTE: `${baseUrlCC}/centralValuation/getReasonOnQuoteStatus/<STATUS>`,
    CALL_TO_CUSTOMER: `${baseUrlCC}/crm/voicecall`,
    SELL_SEND_OTP: `${baseUrlCC}/centralValuation/send/sellOtp`,
    SELL_CONFIRM_OTP: `${baseUrlCC}/centralValuation/offer/accept/otp`,
    HISTORY_DATA_QUOTE: `${baseUrlCC}/centralValuation/quote/callhistory/<LEAD_ID>/<STATUS>`,
    AGENTS_LIST: `${baseUrlCC}/centralValuation/commission/agents`,
    GET_STORE_TRANSACTIONS_LIST: `${PaymentUrl}/shd/getWalletDetails`,
    GET_SHD_TRANSACTION_DETAILS: `${PaymentUrl}/shd/getTransactionDetails`,
    EXPORT_TO_EXCEL_WALLET_CP: `${PaymentUrl}/shd/exportWalletDetailsToExcel/<STORE_ID>`,
    VIEW_USER_CREDIT: `${PaymentUrl}/shd/getWalletCreditLimit/<WALLET_ID>`,
    GENERATE_WALLET_OTP: `${PaymentUrl}/shd/generate/otp/wallet/<USER_ID>`,
    UPDATE_WALLET_CREDIT_LIMIT: `${PaymentUrl}/shd/updateWalletCreditLimit`,
    EXPORT_WALLET_DETAILS: `${PaymentUrl}/shd/exportWalletDetailsToExcel`,
  },
  VALUATOR: {
    GET_USER_LIST: `${baseUrlCC}/pro/v1/getUserList`,
    SEARCH_VALUATOR_USER: `${baseUrlCC}/pro/v1/getUserList`,
    ADD_USER: `${baseUrlCC}/pro/v1/add/user`,
    UPDATE_USER: `${baseUrlCC}/pro/v1/edit/user`,
    GET_USER: `${baseUrlCC}/pro/v1/details/<VALUATOR_ID>`,
    ADD_VALUATOR: `${baseUrlCC}/pro/new/valuator`,
    GET_VALUATOR_PINCODES: `${baseUrlCC}/pincode/ListMapped`,
    SEARCHABLE_PINCODES: `${baseUrlCC}/pincode/allPinodes`,
    UPDATE_PINCODES: `${baseUrlCC}/pincode/updatepincode`,
    UPLOAD_DOCUMENTS: `${baseUrlCC}/pro/uploadUserDocs`,
    GET_PINCODE_SLOTS: `${baseUrlCC}/pincode/getRunnerSlots/<USER_ID>`,
    POST_PINCODE_SLOTS: `${baseUrlCC}/pincode/updateRunnerSlots`
  },
  INVENTORY: {
    LIST_INVENTORY_BY_STATUS: `${baseUrlInspection}/inspection/v1/inventorybystatus`,
    ACCEPT_VEHICLE: `${baseUrlInspection}/inspection/v1/acceptinventory`,
    REJECT_VEHICLE: `${baseUrlInspection}/inspection/v1/publishInventory`,
    GET_VEHICLE_IMAGE: `${baseUrlCC}/pro/v1/viewSummary/<VEHICLE_ID>`,
    GET_ENHANCED_VEHICLE_IMAGE: `${baseUrlInspection}/inspection/bikes/getOptimizedImages/<VEHICLE_ID>`,
    SEARCH_VEHICLE: `${baseUrlInspection}/inspection/v1/inventorybystatus`,
    UPDATE_VEHICLE: `${baseUrlInspection}/inspection/v1/publishInventory`,
    UPLPOAD_VEHICLE_IMAGES: `${baseUrlInspection}/inspection/bikes/uploadImages/<VEHICLE_ID>`,
    DOWNLOAD_IMAGES: `${baseUrlInspection}/inspection/bikes/downloadAllImages/<VEHICLE_ID>`,
    DELETE_IMAGE: `${baseUrlInspection}/inspection/bikes/deleteBikeImage/<IMAGE_ID>`,
    CONFIRM_PUBLISH: `${baseUrlInspection}/inspection/publishShdBike`,
    GET_MAKES_BY_CITYID: `${baseUrlCC}/web/getMake/<CITY_ID>`,
    GET_MODELS: `${baseUrlCC}/web/getModel/<MAKE_NAME>/<CITY_ID>`,
    GET_VARIANTS_BY_MODEL: `${baseUrlCC}/web/getVariant/<MODEL_NAME>`,
    GET_VARIANTS_BY_MODEL_ID: `${baseUrlCC}/lead/bike/variants/<MODEL_ID>`,
    UPDATE_VEHICLE_DETAILS: `${baseUrlInspection}/inspectedBikes/updateDetails`,
    GET_BIKE_IMAGES: `${baseUrlInspection}/inspectedBikes/withImages/<IBD_ID>`,
    UPLOAD_ENHANCED_IMAGES: `${baseUrlInspection}/inspectedBikes/updateStatusAndImages`,
    UPDATE_BIKE_INVENTORY: `${baseUrlInspection}/inspectedBikes/updateStatusAndImages`,
  },
  LOGISTICS: {
    EXPORT_TO_EXEL: `${baseUrlCC}/logistics/v1/exportLogistics`,
    EXPORT_WAREHOUSE: `${baseUrlCC}/logistics/v1/exportWarehouseDelivery`,
    ASSIGN_RUNNER: `${baseUrlCC}/logistics/v1/getVehicleForCoordinator`,
    ASSIGN_RUNNER_TO_INVENTORY: `${baseUrlCC}/logistics/v1/assignRunner`,
    SEARCH_RUNNERS: `${baseUrlCC}/logistics/v1/getVehicleForCoordinator`,
    LIST_WAREHOUSE_DELIVERY: `${baseUrlCC}/logistics/v1/warehouseStatus`,
    VEHICLE_STATUS: `${baseUrlCC}/logistics/v1/getVehicleStatus`,
    GET_RUNNER: `${baseUrlCC}/logistics/v1/getRunner/<LEAD_ID>`,
    LIST_RUNNERS: `${baseUrlCC}/logistics/v1/getRunnerList`,
    LIST_COORDINATOR: `${baseUrlCC}/logistics/getCoordinator/<CITY_ID>`,
    UPLOAD_IMAGES: `${baseUrlCC}/logistics/v1/uploadImagesWeb`,
    ACCEPT_WAREHAOUSE_DELIVEY: `${baseUrlCC}/logistics/v1/confirmDeliveredCoordinatoreWeb`,
    // Assign runner new apis - for logistics cordinator role.
    GET_ALL_VEHICLES: `${baseUrlInspection}/logistics/getBikesListForCoordinator`,
    NEW_ASSIGN_RUNNER: `${baseUrlInspection}/logistics/runnerAssign`,
    GET_IN_CUSTODY_DATA: `${baseUrlCC}/logistics/incustody`,
    IN_CUSTODY_ACTION: `${baseUrlCC}/auction/incustody`
  },
  DOCUMENTQC: {
    GET_QC_LIST: `${baseUrlCC}/lead/v1/qcDashBoard`,
    GET_QCBIKEDOCUMENTS: `${baseUrlCC}/lead/getQcBikeDocs/<LEAD_ID>/<qc_approval_type>`,
    UPDATE_DOCUMENTQC_STATUS: `${baseUrlCC}/lead/verify/qc`,
    UPLOAD_MULTIPLE_IMAGES: `${baseUrlInspection}/franchise/uploadMultiImage`,
    GET_REASON: `${baseUrlCC}/lead/rejected/qcDoc/<LEAD_ID>`,
    CALL_TO_VALUATOR: `${baseUrlCC}/lead/v1/callToValuator`,
    EDIT_VEHICLE_YEAR: `${baseUrlCC}/lead/update/year`,
    GET_REASONS: `${baseUrlCC}/lead/getReasonsOnType/<QC_ID>`,
    EDIT_REG_NUMBER: `${baseUrlInspection}/inspection/update/registration`,
    UPDATE_MMV: `${baseUrlCC}/lead/update/mmv`,
    UPDATE_BANK_DETAILS: `${baseUrlCC}/lead/updateBankDetails`,
    UPDATE_RAZORPAY_NAME: `${baseUrlCC}/lead/updateRazorpayName`,
    UPDATE_BANK_STATUS: `${baseUrlCC}/lead/bankVerification`,
    VALIDATE_ACCOUNT_DETAILS: `${PaymentUrl}/bankVerification/verifyAccountDetails`,
    GET_DETAILS_FUND_ID: `${PaymentUrl}/bankVerification/getDetailsById`,
  },
  FRANCHISE: {
    FRANCHISE_LIST_INVENTORY: `${baseUrlInspection}/franchise/v1/fmbikes`,
    GET_FRANCHISE_CITY_LIST: `${baseUrlCC}/crm/getcities`,
    FRANCHISE_STORES: `${baseUrlInspection}/franchise/stores/<CITY_ID>`,
    FRANCHISE_STORE_LEADS: `${baseUrlCC}/crm/v1/storeLeads`,
    FRANCHISE_SALES: `${baseUrlInspection}/franchise/v1/sales`,
    FRANCHISE_ASSIGN: `${baseUrlInspection}/franchise/v1/assign/multi`,
    UPDATE_MOBILE_NUMBER: `${baseUrlCC}/crm/update/mobileNo`,
    UPLOAD_MULTIPLE_IMAGES: `${baseUrlInspection}/franchise/uploadMultiImage`,
    UPDATE_PAYMENT_DETAILS: `${baseUrlInspection}/franchise/documents/upload`,
    APPROVE_PAYMENT_DETAILS: `${baseUrlInspection}/franchise/approvepayment`,
    GET_IMAGES: `${baseUrlInspection}/franchise/images/<ORDER_ID>`,
    FHD_SHD_STORE_LIST: `${baseUrlCC}/pro/storelistuser`,
    VALUATOR_LIST: `${baseUrlCC}/performance/getValuatoreDetails`,
    PENDING_ASSIGNMENT_REPORTS: `${baseUrlInspection}/franchise/pendingassignment/reports`,
    ASSIGNED_REPORTS: `${baseUrlInspection}/franchise/assigned/reports`,
    LIVE_INVENTORY_REPORTS: `${baseUrlInspection}/franchise/liveinventory/reports`,
    MANAGE_SALES_REPORTS: `${baseUrlInspection}/franchise/manageSales/reports`,
    PENDING_PAYMENT_REPORTS: `${baseUrlInspection}/franchise/pendingpayment/reports`,
    APPROVAL_PAYMENT_REPORTS: `${baseUrlInspection}/franchise/approvalpayment/reports`,
    APPROVED_PAYMENT_REPORTS: `${baseUrlInspection}/franchise/approvedpayment/reports`,
    FRANCHISE_REASSIGN: `${baseUrlInspection}/franchise/v1/reassign`,
    UPLOAD_PROFILE_BANNER_TO_S3: `${baseUrlInspection}/franchise/uploadUserImage`,
    FETCH_FRANCHISE_PROFILE: `${baseUrlInspection}/franchise/profile/<USER_ID>`,
    UPDATE_FRANCHISE_PROFILE: `${baseUrlInspection}/franchise/update/profile`,
    UPDATE_FRANCHISE_PROFILE_IMAGES: `${baseUrlInspection}/franchise/changeBackgroundImage`,
    GET_RETURNS: `${baseUrlInspection}/returndetails/all/?<QUERY_PARAMS>`,
    UPDATE_RETURN_RECORD_STATUS: `${baseUrlInspection}/returndetails/<ID>`,
    FRANCHISE_PENDING_RETURN_INVENTORY: `${baseUrlInspection}/returndetails/fmBikesReturn?<QUERY_PARAMS>`,
    PENDING_RETURN_CREATE_RETURN_LOGISTIC: `${baseUrlInspection}/returndetails/assign/multiReturnBikes`,
    STORE_LEADS: `${baseUrlCC}/crm/storeLeads`,
    STORE_SALES: `${baseUrlInspection}/franchise/sales`,
    PAYMENT_HISTORY: `${PaymentUrl}/fm/history`,
    FRANCHISE_WALLET_BALANCE: `${PaymentUrl}/fm/balance`,
    UPLOAD_PAYMENT_PROOF: `${baseUrlInspection}/franchise/uploadFile`,
    GET_MMV_BY_REG_NUM: `${baseUrlCC}/crm/bike/details/regNumber`,
    CREATE_WALK_IN_LEAD: `${baseUrlCC}/crm/create/lead`,
    MARK_AS_SOLD: `${baseUrlCC}/crm/markAsSold`,
    REFUND_TOKEN: `${baseUrlInspection}/franchise/refund`,
    GET_SALES_DOCS: `${baseUrlCC}/invoice/getSalesDocLink/<LEAD_ID>`,
    FRANCHISE_DELIVERY_STATUS: `${baseUrlInspection}/franchise/delivery/status`,
    UPLOAD_CUSTOMER_KYC: `${baseUrlInspection}/franchise/saveCustomerKyc`,
    GET_BIKE_SOLD_STATUS: `${baseUrlCC}/invoice/getSoldStatus/<REG_NUM>`,
    GET_REFERRAL_SOURCE: `${baseUrlCC}/business/getReferralSource`
  },
  POSTSALES: {
    GET_DOCUMENTATION_LEADS: `${baseUrlCC}/crm/v1/postsales/enquiry`,
    UPDATE_ALTERNATE_MOBILENUMBER: `${baseUrlCC}/crm/update/mobileNo`,
  },
  BIKEPRIORITY: {
    GET_BIKE_PRIORITIES: `${baseUrlInspection}/bike/get/priority`,
    SUBMIT_PRIORITY_LIST: `${baseUrlInspection}/bike/priority/submit`,
    PREVIEW_PRIORITY_LIST: `${baseUrlInspection}/bike/priority/preivew`,
    APPLY_BIKE_PRIORITY_FILTER: `${baseUrlInspection}/bike/list`,
  },
  MISC: {
    GET_CITY_LIST: `${baseUrlCC}/pro/getCityList`,
    STORE_LIST: `${baseUrlCC}/web/storelist/<CITY_ID>`,
    INSPECTOR_LIST: `${baseUrlCC}/pro/v1/getinspectordetails/<CITY_ID>`,
    FHD_SHD_STORE_LIST: `${baseUrlCC}/pro/storelistuser`,
    GET_DOC_QC_CITY_LIST: `${baseUrlCC}/lead/role/city/<USER_ID>`,
    GET_VALUATOR_LIST: `${baseUrlCC}/pro/getValuatorList/<CITY_ID>`,
    UPDATE_USER_PROFILE: `${baseUrlCC}/user/update/userdata`,
    UPDATE_USER_IMAGE: `${baseUrlCC}/user/uploadProfileImage`,
    UPDATE_NAME_EMAIL: `${baseUrlCC}/lead/updateUser`,
    UPDATE_CUSTOMER_EXPECTED_PRICE: `${baseUrlCC}/corporate/updateSHDCalling`,
    DROP_REASONS: `${baseUrlCC}/pro/reasons/drop`,
    MARK_IT_AS_DROPPED: `${baseUrlCC}/pro/updateLead/inspectionDrop`
  },
  PERFORMANCE: {
    GET_CONVERSIONAL_LIST: `${baseUrlCC}/performance/conversionalAndTatResult`,
    GET_PRICING_LIST: `${baseUrlCC}/performance/pricingPerformance`,
    GET_OUTLET_PROF_LIST: `${baseUrlCC}/performance/outletPerformance`,
    GET_VALUATOR_PROF_LIST: `${baseUrlCC}/performance/valuatorPerformance`,
    GET_VALUATOR_DATA: `${baseUrlCC}/performance/getValuatoreDetails`,
    STORE_LIST: `${baseUrlCC}/performance/getStoreList`,
  },
  SPARE_PARTS_MASTER: {
    GET_SPARE_PARTS_MASTER_DATA: `${SPMUrlCC}/spareParts/`,
    SPM_DATA_SEARCH: `${SPMUrlCC}/spareParts/search`,
    ADD_SPARE_PART: `${SPMUrlCC}/spareParts/sparePart`,
  },
  MMV_MANAGEMENT: {
    GET_MMV_LIST: `${SPMUrlCC}/spareParts/mmv`,
    ADD_NEW_MMV: `${SPMUrlCC}/spareParts/mmvYears/mmvYear`,
    GET_MMV_TABLE: `${SPMUrlCC}/spareParts/mmvYears/`,
    MMV_DATA_SEARCH: `${SPMUrlCC}/spareParts/mmvYears/search`,
  },
  LIVE_INVENTORY_UNIT: {
    GET_LIUNIT_TABLE: `${SPMUrlCC}/spareParts/inventory/live/`,
    GET_ALL_WAREHOUSES: `${SPMUrlCC}/spareParts/inventory/warehouses`,
    GET_ALL_VENDORS: `${SPMUrlCC}/spareParts/inventory/vendors`,
    GET_ALL_SPAREPARTS: `${SPMUrlCC}/spareParts/inventory/section/parts`,
    GET_ALL_SPAREPARTS_WITH_SECTION: `${SPMUrlCC}/spareParts/inventory/all/parts`,
    GET_ALL_CATEGORIES: `${SPMUrlCC}/spareParts/inventory/category/parts`,
    GET_ALL_MMV_RANGE: `${SPMUrlCC}/spareParts/inventory/mmvs`,
    LIUNIT_SEARCH: `${SPMUrlCC}/spareParts/inventory/live/search`,
    SUBMIT_INWARDING: `${SPMUrlCC}/spareParts/inventory/inward`,
    SAVE_INWARDING: `${SPMUrlCC}/spareParts/inventory/saveUnbilledInventory`,
  },
  INVENTORY_AGGREGATE: {
    GET_TABLE_DATA: `${SPMUrlCC}/spareParts/aggregate/inventory/`,
    SEARCH_TABLE_DATA: `${SPMUrlCC}/spareParts/aggregate/inventory/search`,
  },
  SPARE_PARTS_ASSIGNMENT: {
    GET_TABLE_DATA: `${SPMUrlCC}/spareParts/bikeRepairRequests`,
    SEARCH_TABLE_DATA: `${SPMUrlCC}/spareParts/bikeRepairRequest/search`,
    REPAIR_REQUEST_DATA: `${SPMUrlCC}/spareParts/bikeRepairRequests/`,
    SUBMIT_REPAIR_REQUEST: `${SPMUrlCC}/spareParts/bikeRepairRequest/assign`,
    DOWNLOAD_DATA: `${SPMUrlCC}/spareParts/bikeRepairRequest/export`,
    WAREHOUSE_AND_REPAIRCENTER: `${SPMUrlCC}/spareParts/inventory/serviceCenters`,
    CREATE_PARTS_REQUISITION: `${SPMUrlCC}/spareParts/auto/requisition/`,
  },
  PARTS_REQUIREMENT: {
    GET_TABLE_DATA: `${SPMUrlCC}/spareParts/requisition/`,
    SEARCH_TABLE_DATA: `${SPMUrlCC}/spareParts/requisition/search`,
    SUBMIT_REQUIREMENT: `${SPMUrlCC}/spareParts/requisition/`,
    AGGREGATE_ORDER: `${SPMUrlCC}/spareParts/requisition/aggregate`,
    RUNNER_LIST: `${baseUrlInspection}/inspection/user/runners/`,
    VENDOR_LIST: `${SPMUrlCC}/spareParts/inventory/vendors/`,
    CREATE_ORDER: `${SPMUrlCC}/spareParts/order/`,
  },
  REQUISITION_AGGREGATE: {
    GET_TABLE_DATA: `${SPMUrlCC}/spareParts/requisition/aggregates/`,
    SEARCH_TABLE_DATA: `${SPMUrlCC}/spareParts/requisition/aggregates/search`,
  },
  PARTS_ORDER_HISTORY: {
    GET_TABLE_DATA: `${SPMUrlCC}/spareParts/orders`,
    SEARCH_TABLE_DATA: `${SPMUrlCC}/spareParts/orders/search`,
    ORDER_DETAILS: `${SPMUrlCC}/spareParts/order/`,
    DISCARD_ORDER: `${SPMUrlCC}/spareParts/order/discard/`,
  },
  MY_ASSIGNMENTS: {
    GET_ALL_ASSIGNMENTS: `${SPMUrlCC}/spareParts/runner/orders/`,
    UPDATE_ORDER: `${SPMUrlCC}/spareParts/order`,
    START_RUN: `${SPMUrlCC}/spareParts/order/startRun`,
    CANCEL_RUN: `${SPMUrlCC}/spareParts/order/cancelRun/`,
  },
  VENDOR_MANAGEMENT: {
    GET_TABLE_DATA: `${SPMUrlCC}/spareParts/vendors/`,
    SEARCH_TABLE_DATA: `${SPMUrlCC}/spareParts/vendor/search/`,
    ADD_VENDOR: `${SPMUrlCC}/spareParts/vendor/details`,
    GET_VENDOR_DETAILS: `${SPMUrlCC}/spareParts/vendor/detail/`,
    DELETE_VENDOR_DETAILS: `${SPMUrlCC}/spareParts/vendor/`,
  },
  PAYMENT_SPM: {
    GET_TABLE_DATA: `${SPMUrlCC}/spareParts/payments/`,
    SEARCH_TABLE_DATA: `${SPMUrlCC}/spareParts/payments/search`,
    DOWNLOAD_DATA: `${SPMUrlCC}/spareParts/payments/export`,
  },
  REFURBISHMENT: {
    GET_REFURB_DATA: `${baseUrlCC}/qc/refurbDashboard`,
    GET_REFURB_URL: `${baseUrlInspection}/qc/showJobcard?rmId=<ID>`,
    GET_INSPECTION_DETAILS: `${baseUrlCC}/qc/valuatorParam/<ID>`,
    UPDATE_REFUB_COST: `${baseUrlCC}/qc/updateParam`,
  },
  VALUATOR_DASHBOARD: {
    AUDIT_CALL_RECORD: `${baseUrlCC}/pro/call/info/<LEAD_ID>`,
    LIST: `${baseUrlCC}/pro/valuator/details`,
    REASSIGN_RESCHEDULE: `${baseUrlCC}/pro/schedule`,
    GET_REFURB_DATA: `${baseUrlCC}/qc/refurbDashboard`,
    GET_DROP_REASONS_VDB: `${baseUrlCC}/lead/getSellOnlyReasons`,
    DROP_LEAD: `${baseUrlCC}/directCalling/updateLead/Drop`
  },
  BUFFER_PRICE_ONLINE_SELL: {
    GET_BUFFER_DATA: `${baseUrlCC}/centralValuation/v1/priceRequestedLeads`,
    SAVE_FM_PRICE: `${baseUrlCC}/centralValuation/saveFmPrice`,
  },
  AUDIT: {
    GET_AUDIT_INFO: `${baseUrlCC}/audit/<USER_ID>`,
    SUBMIT_AUDIT_FEEDBACK: `${baseUrlCC}/audit/feedback`,
  },
  GET_PAPER_TRANSFER: {
    GET_PAPER_TRANSFER_DATA: `${baseUrlCC}/crm/getPaperTransferDetails`,
    CALL_PT_AGENT: `${baseUrlCC}/crm/callToCustomer`,
    GET_VIEW_PENDING: `${baseUrlCC}/lead/getDocListForPtAgent/<LEAD_ID>`,
    SUBMIT_STAGE1: `${baseUrlCC}/lead/bikeDocumentsUpload`,
    GET_VIEW_OTHER_LEADS: `${baseUrlCC}/lead/getQcBikeDocs/<LEAD_ID>/PTDOCS`,
    GET_SMS_FOR_STAGES: `${baseUrlCC}/crm/messageToCustomer`,
  },
  FRANCHISE_STORE_MANAGER: {
    ELIGIBLE_RETURN_BIKES: `${baseUrlInspection}/return/bikes`,
    ALL_PENDING_RETURNS: `${baseUrlInspection}/returndetails/all/`,
    UPLOAD_DOCS: `${baseUrlInspection}/franchise/uploadMultiImage`,
    CREATE_REQUEST_RETURN: `${baseUrlInspection}/returndetails`,
    ALL_PENDING_RETURNS: `${baseUrlInspection}/returndetails/all/?<QUERY_PARAMS>`,
    DOUCMENT_URLS_BY_ID: `${baseUrlInspection}/returndetails/documents/<ID>`,
    UPDATE_RECORD_DETAILS: `${baseUrlInspection}/returndetails/<ID>`,
    RETURN_POLICY_DETAILS: `${baseUrlInspection}/return/policies/policy/<ID>`,
    GET_BUSINESS_ENTITES: `${baseUrlCC}/business/getAllEntity/<ID>`,
    GET_STATES: `${baseUrlCC}/business/getAllState`,
    GET_CITIES: `${baseUrlCC}/business/getAllCities/<ID>`,
    ADD_ENTITY: `${baseUrlCC}/business/createEntity`,
    UPDATE_ENTITY: `${baseUrlCC}/business/updateEntity`,
    GET_ENTITY: `${baseUrlCC}/business/getEntity/<ID>`,
    GET_ALL_BILLER_IDS: `${baseUrlCC}/invoice/getAllBillerIds/<ID>`,
    GET_HSN_LIST: `${baseUrlCC}/recipient/getHsnList`,
    ADD_RECIPIENT: `${baseUrlCC}/recipient/addrecipient`,
    GENERATE_OTP: `${baseUrlCC}/crm/generateOtp`,
    VERIFY_STORE_OTP: `${baseUrlCC}/crm/verifyOTP`,
    RESEND_OTP: `${baseUrlCC}/crm/reSendOTP`,
    GET_INVOICES: `${baseUrlCC}/invoice/getInvoice`,
    GET_STORE_INVENTORY: `${baseUrlCC}/crm/bikes/<STORE_ID>`,
    ASSIGN_INVENTORY: `${baseUrlCC}/crm/assign/inventory`,
    GET_WARRANTY: `${baseUrlCC}/invoice/getWarrantyCode`,
    GET_SERVICE_CODE: `${baseUrlCC}/invoice/getServiceCode`,
    GET_MIN_PRICE: `${baseUrlCC}/crm/minBikePrice/<REG_NUM>`
  },
  SUPPLY: {
    UPDATE_STATUS_QUOTE: `${baseUrlCC}/centralValuation/quoteUpdate/statusCall`,
    GET_REASONS_QUOTE: `${baseUrlCC}/centralValuation/getReasonOnQuoteStatus/<STATUS>`,
    HISTORY_DATA_QUOTE: `${baseUrlCC}/centralValuation/quote/callhistory/<LEAD_ID>/<STATUS>`,
  },
  // GET_PAPER_TRANSFER : {
  //   GET_PAPER_TRANSFER_DATA: `${baseUrlCC}/crm/getPaperTransferDetails`,
  //   CALL_PT_AGENT: `${baseUrlCC}/crm/callToCustomer`,
  //   GET_VIEW_PENDING: `${baseUrlCC}/lead/getDocListForPtAgent/<LEAD_ID>`,
  //   SUBMIT_STAGE1: `${baseUrlCC}/lead/bikeDocumentsUpload`,
  //   GET_VIEW_OTHER_LEADS: `${baseUrlCC}/lead/getQcBikeDocs/<LEAD_ID>/PTDOCS`,
  //   GET_SMS_FOR_STAGES: `${baseUrlCC}/crm/messageToCustomer`
  // },
  GET_PAPER_TRANSFER: {
    GET_PAPER_TRANSFER_DATA: `${baseUrlCC}/crm/getPaperTransferDetails`,
    CALL_PT_AGENT: `${baseUrlCC}/crm/callToCustomer`,
    GET_VIEW_PENDING: `${baseUrlCC}/lead/getDocListForPtAgent/<LEAD_ID>`,
    SUBMIT_STAGE1: `${baseUrlCC}/lead/bikeDocumentsUpload`,
    GET_VIEW_OTHER_LEADS: `${baseUrlCC}/lead/getQcBikeDocs/<LEAD_ID>/PTDOCS`,
    GET_SMS_FOR_STAGES: `${baseUrlCC}/crm/messageToCustomer`,
  },
  RAZORPAY_URLS: {
    PROCESS_PAYMENT: `${PaymentUrl}/payments/process_payment`,
    VERIFY_PAYMENT: `${PaymentUrl}/payments/verify_payment`,
    LOAD_PAYMENT: `${PaymentUrl}/fm/razorpay/validate/load`,
    FRANCHISE_RAZORPAY: `${PaymentUrl}/fm/payment/razorpay`,
    REDEEM_WALLET: `${PaymentUrl}/fm/redeem`,
    GET_OTP: `${PaymentUrl}/fm/send/otp/<USER_ID>`,
    VERIFY_OTP: `${PaymentUrl}/fm/verify/otp`,
    PAYMENTS_HISTORY: `${PaymentUrl}/fm/history`,
  },
  PRIMARY_SECONDARY_SALES: {
    STORE: `${baseUrlCC}/pro/credr/store`,
    FRANCHISE: `${baseUrlCC}/pro/credr/franchise`,
    CMS: `${baseUrlCC}/pro/cms/sales`,
    SECONDARY_FRANCHISE: `${baseUrlCC}/pro/secondary/franchise/sales`,
    STORE_EXPORT_DATA: `${baseUrlCC}/pro/credr/store/export`,
    FRANCHISE_EXPORT_DATA: `${baseUrlCC}/pro/credr/franchise/export`,
    CMS_EXPORT_DATA: `${baseUrlCC}/pro/cms/sales/export`
  },
  // QUOTE_CONFLIRMATION: {
  //   LEAD_LIFE_CYCLE
  // }
};

export { RAZORPAY_ID };
