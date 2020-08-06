<template>
  <div class="applicant-details">
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="applicant-details__profile">
      <div class="applicant-details-holder">
      <el-card class="applicant-details__profile__personal-details">
        <el-button type="primary back-button" @click="handleBack"><i class="fa fa-arrow-left el-icon-right back-icon"></i> Back to List</el-button>
        <div class="applicant-details__profile_content">
          <div class="applicant-details__profile_content">
            <div class="applicant-details__application_type">Application Type</div>
            <div class="applicant-details__application_type_value">{{ applicant_details.application_type }}</div>
          </div>
          <div class="applicant-details__profile_content">
            <div class="applicant-details__application_type applicant-name">{{ applicant_details.applicant_username }}</div>
            <div class="applicant-details__application_type_identity">
              <span>{{ applicant_details.id_no }}</span>
              <span class="identity-label">National ID</span>
            </div>
             <div class="applicant-details__application_type_identity">
              <span>{{ applicant_details.kra_pin }}</span>
              <span class="identity-label">{{ taxPayerNameIdentifier }} Number</span>
            </div>
            <div class="applicant-details__application_type_identity text-uppercase ">{{ applicant_details.partner_country }}</div>
          </div>
          <div class="applicant-details__profile_content" v-if="applicant_details.application_type !== 'Owner'">
            <div class="applicant-details__application_date">
              <span class="applicant-vehicle">{{ getVendorType(applicant_details.vendor_type) }}</span>

              <span>{{ applicant_details.vehicle_reg_no }}</span>
              <span class="identity-label">Assigned Vehicle</span>
            </div>
          </div>
          <div class="applicant-details__profile_content">
            <div class="applicant-details__application_date">
              <span>{{ formatDate(applicant_details.date_created) }}</span>
              <span class="identity-label">Application Date</span>
            </div>
          </div>
          <el-button type="primary status-button inconsistent-status"> Inconsistent</el-button>
        </div>
      </el-card>

      <el-card
        header="Data Inconsistency"
        class="applicant-details__inconsistency-messsage-wrap"
        v-if="applicant_details.inconsistency_message.length > 0"
      >
        <div
          class="applicant-details__inconsistency-message"
        >{{ applicant_details.inconsistency_message }}</div>
      </el-card>
        <el-card header="Activity" class="applicant-details__profile__personal-details activity-logs" v-show="partner_logs.length > 0">
            <ul class="logs-list">
              <li v-for="log in partner_logs.slice().reverse()" :key="log.index">
                <span class="statement-log">{{ createLogStatement(log).statement }} </span>
                <span class="statement-time">{{ createLogStatement(log).date }} </span>
                <span class="statement-time">{{ createLogStatement(log).time }} </span>

                <span></span>
              </li>
            </ul>
          </el-card>
    </div>
   </div>
    <div class="applicant-details__data">
     <div class="applicant-details__data_holder">
        <el-card class="applicant-details__profile__personal-details verification-content">
          <span class="verification-header">Verify {{ applicant_details.application_type }} Details</span>
        </el-card>
      <el-collapse class="verification-collapse" v-model="accordionActiveName">
        <div class="applicant--details-wrap">
          <el-collapse-item name="1" :class="verification_details.identity_check.inconsistency ?'inconsistent-collapse' : '' " class="verification-wrap" >
            <template slot="title">
              <span style>Identity Check</span>
            </template>
            <el-form :model="verification_details.identity_check" v-show="!identityReview">
              <el-form-item label="Name of Applicant">
                <el-input
                  v-model="verification_details.identity_check.applicant_name"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="Date of Birth">
                <el-date-picker
                  v-model="verification_details.identity_check.dob"
                  type="date"
                  popper-class="date-popup"
                  placeholder="Date of Birth"
                ></el-date-picker>
              </el-form-item>

              <el-form-item label="Place of Birth">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="verification_details.identity_check.pob"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="Gender">
                <el-select v-model="verification_details.identity_check.gender" auto-complete="off">
                  <el-option value="Male">Male</el-option>
                  <el-option value="Female">Female</el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  class="details-save-button"
                  @click="updateReview('identity_check', 'Identity Check')"
                >SAVE</el-button>
              </el-form-item>
            </el-form>
            <div class="review_wrap" v-show="verification_details.identity_check.review_status">
              <div class="el-row">
                <div class="el-col-lg-16 review-details">
                  <div class="el-row">
                    <div class="review-title">Name of Applicant</div>
                    <div
                      class="review-desc"
                    >{{ this.verification_details.identity_check.applicant_name }}</div>
                  </div>
                  <div class="el-row" v-show="applicant_details.application_type !== 'Driver'">
                    <div class="review-title">Date of Birth</div>
                    <div
                      class="review-desc"
                    >{{ formatDate(this.verification_details.identity_check.dob) }}</div>
                  </div>
                  <div class="el-row" v-show="applicant_details.application_type !== 'Driver'">
                    <div class="review-title">Place of Birth</div>
                    <div class="review-desc">{{ this.verification_details.identity_check.pob }}</div>
                  </div>
                  <div class="el-row">
                    <div class="review-title">Gender</div>
                    <div class="review-desc">{{ this.verification_details.identity_check.gender }}</div>
                  </div>
                </div>
                <div class="el-col-lg-8 review-image">

                </div>
              </div>
            </div>
          </el-collapse-item>
          <div
            class="applicant--incosistency-mark"
            v-if="verification_details.identity_check.inconsistency"
          >Marked for Data Inconsistency</div>
        </div>
        <div
          class="applicant--details-wrap"
          v-show="applicant_details.application_type !== 'Owner'"
        >
          <el-collapse-item
            title="Driving License Check"
            name="3"
            :class="verification_details.driving_license_check.inconsistency? 'inconsistent-collapse':''"
            class="verification-wrap"
>
            <el-form :model="verification_details.driving_license_check" v-show="!drivingReview">
              <el-form-item label="Name of Applicant" :label-width="'25%'">
                <el-input
                  v-model="verification_details.driving_license_check.applicant_name"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="DL Number" :label-width="'25%'">
                <el-input
                  v-model="verification_details.driving_license_check.dl_no"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="Date of Issue" :label-width="'25%'">
                <el-date-picker
                  v-model="verification_details.driving_license_check.date_of_issue"
                  type="date"
                  popper-class="date-popup"
                  placeholder="Date of Issue"
                ></el-date-picker>
              </el-form-item>

              <el-form-item label="Expiry Date" :label-width="'25%'">
                <el-date-picker
                  v-model="verification_details.driving_license_check.expiry_date"
                  type="date"
                  popper-class="date-popup"
                  placeholder="Expiry Date"
                ></el-date-picker>
              </el-form-item>

              <el-form-item label="Classes" :label-width="'25%'">
                <el-input
                  v-model="verification_details.driving_license_check.classes"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="Id Number" :label-width="'25%'">
                <el-input
                  v-model="verification_details.driving_license_check.id_no"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  class="details-save-button"
                  @click="updateReview('driving_license_check', 'Driving License Check')"
                >SAVE</el-button>
              </el-form-item>
            </el-form>
            <div class="el-row" v-show="drivingReview">
              <div class="el-col-lg-16 review-details">
                <div class="el-row">
                  <div class="review-title">Name of Applicant</div>
                  <div
                    class="review-desc"
                  >{{ this.verification_details.driving_license_check.applicant_name }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">DL Number</div>
                  <div
                    class="review-desc"
                  >{{ this.verification_details.driving_license_check.dl_no }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Date of Issue</div>
                  <div
                    class="review-desc"
                  >{{ formatDate(this.verification_details.driving_license_check.date_of_issue) }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Expiry Date</div>
                  <div
                    class="review-desc"
                  >{{ formatDate(this.verification_details.driving_license_check.expiry_date) }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Classes</div>
                  <div
                    class="review-desc"
                  >{{ this.verification_details.driving_license_check.classes }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">ID Number</div>
                  <div
                    class="review-desc"
                  >{{ this.verification_details.driving_license_check.id_no }}</div>
                </div>
              </div>
              <div class="el-col-lg-8 review-image">
                <!--<div class="review-edit" @click="handleReviewEdit('driving_license_check')">Edit</div>-->
              </div>
            </div>
          </el-collapse-item>
          <div
            class="applicant--incosistency-mark"
            v-if="verification_details.driving_license_check.inconsistency"
          >Marked for Data Inconsistency</div>
        </div>
        <div
          class="applicant--details-wrap"
          v-show="applicant_details.application_type !== 'Driver'"
        >
          <el-collapse-item
            name="4"
            :class="verification_details.motor_vehicle_records_check.inconsistency? 'inconsistent-collapse':''"
            class="verification-wrap"
>
            <template slot="title">
              <span>Motor Vehicle Records Check</span>
            </template>

            <el-form
              :model="verification_details.motor_vehicle_records_check"
              v-show="!motorReview"
              class="el-col-lg-15 review-details"
            >
              <el-form-item label="Ownership Details and Address" :label-width="'25%'">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="verification_details.motor_vehicle_records_check.ownership_details"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="Vehicle Make" :label-width="'25%'">
                <el-input
                  v-model="verification_details.motor_vehicle_records_check.make"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="Vehicle Body Type" :label-width="'25%'">
                <el-input
                  v-model="verification_details.motor_vehicle_records_check.body_type"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="Engine No" :label-width="'25%'">
                <el-input
                  v-model="verification_details.motor_vehicle_records_check.engine_no"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="Chasis No" :label-width="'25%'">
                <el-input
                  v-model="verification_details.motor_vehicle_records_check.chasis_no"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="Year of Manufacture" :label-width="'25%'">
                <el-date-picker
                  v-model="verification_details.motor_vehicle_records_check.manufacture_year"
                  type="year"
                  popper-class="date-popup"
                  placeholder="Year of Manufacture"
                ></el-date-picker>
              </el-form-item>

              <el-form-item label="Caveats" :label-width="'25%'">
                <el-input
                  v-model="verification_details.motor_vehicle_records_check.caveats"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  class="details-save-button"
                  @click="
                    updateReview('motor_vehicle_records_check', 'Motor Vehicle Records Check')
                  "
                >SAVE</el-button>
              </el-form-item>
            </el-form>

            <div v-show="motorReview" class="el-col-lg-16 review-details">
              <div class="el-row">
                <div class="review-title">Ownership Details and Address</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.motor_vehicle_records_check.ownership_details }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Vehicle Make</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.motor_vehicle_records_check.make }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Vehicle Body Type</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.motor_vehicle_records_check.body_type }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Engine No</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.motor_vehicle_records_check.engine_no }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Chasis No</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.motor_vehicle_records_check.chasis_no }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Year of Manufacture</div>
                <div class="review-desc">
                  {{
                  formatYear(
                  this.verification_details.motor_vehicle_records_check.manufacture_year
                  )
                  }}
                </div>
              </div>
              <div class="el-row">
                <div class="review-title">Caveats</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.motor_vehicle_records_check.caveats }}</div>
              </div>

              <div class="el-row">
                <div class="review-title">{{ taxPayerNameIdentifier }} Number of Owner</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.motor_vehicle_records_check.owner_kra }}</div>
              </div>
            </div>
            <div class="el-col-lg-8 review-image">

            </div>
          </el-collapse-item>

          <div
            class="applicant--incosistency-mark"
            v-if="verification_details.motor_vehicle_records_check.inconsistency"
          >Marked for Data Inconsistency</div>
        </div>
        <div
          class="applicant--details-wrap"
          v-show="applicant_details.application_type !== 'Driver'"
        >
          <el-collapse-item
            name="5"
            v-show="applicant_details.application_type !== 'Driver'"
            :class="verification_details.car_insurance_validity.inconsistency? 'inconsistent-collapse':''"
            class="verification-wrap"
>
            <template slot="title">
              <span>Car Insurance Validity</span>
            </template>
            <el-form
              :model="verification_details.car_insurance_validity"
              class="el-col-lg-15 review-details"
              v-show="!insuranceReview"
            >
              <div
                id="print"
                class="el-row"
                v-show="this.applicant_details.application_type !== 'Driver'"
              >
                <div class="review-consent-text">
                  I, {{ this.applicant_details.partner_name }} (ID Number
                  {{ this.applicant_details.id_no }}), {{ this.appendConsentText() }}
                </div>
                <div class="no-print">
                  <el-button
                    type="primary"
                    class="details-print-button"
                    @click="printInsurance"
                  >PRINT</el-button>
                </div>
                <div>
                  <b>Insurance Company:</b>
                  {{ this.applicant_details.insurance_name }}
                </div>
                <div>
                  <b>Insurance Cert Number:</b>
                  {{ this.applicant_details.insurance_number }}
                </div>
                <div class="review-list">
                  <b>Policy Number:</b>
                  {{ this.applicant_details.policy_number }}
                </div>
                <hr>
              </div>
              <el-form-item label="Name of Owner" :label-width="'25%'">
                <el-input
                  v-model="verification_details.car_insurance_validity.owner_name"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="Vehicle Number Plate" :label-width="'25%'">
                <el-input
                  v-model="verification_details.car_insurance_validity.vehicle_number_plate"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="Issue Date" :label-width="'25%'">
                <el-date-picker
                  v-model="verification_details.car_insurance_validity.issue_date"
                  type="date"
                  popper-class="date-popup"
                  placeholder="Issue Date"
                ></el-date-picker>
              </el-form-item>

              <el-form-item label="Expiry Date" :label-width="'25%'">
                <el-date-picker
                  v-model="verification_details.car_insurance_validity.expiry_date"
                  type="date"
                  popper-class="date-popup"
                  placeholder="Expiry Date"
                ></el-date-picker>
              </el-form-item>

              <el-form-item label="Validity" :label-width="'25%'">
                <el-input
                  v-model="verification_details.car_insurance_validity.validity"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="Policy Number" :label-width="'25%'">
                <el-input
                  v-model="verification_details.car_insurance_validity.policy_number"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="Insurance Cert Number" :label-width="'25%'">
                <el-input
                  v-model="verification_details.car_insurance_validity.insurance_cert_number"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  class="details-save-button"
                  @click="updateReview('car_insurance_validity', 'Car Insurance Validity Check')"
                >SAVE</el-button>
              </el-form-item>
            </el-form>
            <div class="el-col-lg-24 review-details" v-show="insuranceReview">
              <div
                id="print"
                class="el-row"
                v-show="this.applicant_details.application_type !== 'Driver'"
              >
                <div class="review-consent-text">
                  I, {{ this.applicant_details.partner_name }} (ID Number
                  {{ this.applicant_details.id_no }}), {{ this.appendConsentText() }}
                </div>
                <div class="no-print">
                  <el-button
                    type="primary"
                    class="details-print-button"
                    @click="printInsurance"
                  >PRINT</el-button>
                </div>
               <div>
                    <b class="insurance-label">Insurance Company:</b>
                    <span class="insurance-value">{{ applicant_details.insurance_name }}</span>
                  </div>
                  <div>
                    <b class="insurance-label">Insurance Cert Number:</b>
                    {{ applicant_details.insurance_number }}
                  </div>
                  <div class="review-list">
                    <b class="insurance-label">Policy Number:</b>
                    {{ applicant_details.policy_number }}
                  </div>
                  <hr class="insurance-divider" />
                  <b class="insurance-subtitle">Authorization to verify Insurance Certificate:</b>
                  <hr class="insurance-divider" />
              </div>
              <div class="el-row">
                <div class="review-title">Name of Owner</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.car_insurance_validity.owner_name }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Vehicle Number Plate</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.car_insurance_validity.vehicle_number_plate }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Issue Date</div>
                <div
                  class="review-desc"
                >{{ formatDate(this.verification_details.car_insurance_validity.issue_date) }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Expiry Date</div>
                <div
                  class="review-desc"
                >{{ formatDate(this.verification_details.car_insurance_validity.expiry_date) }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Validity</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.car_insurance_validity.validity }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Policy Number</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.car_insurance_validity.policy_number }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Insurance Cert Number</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.car_insurance_validity.insurance_cert_number }}</div>
              </div>
            </div>
            <div class="el-col-lg-7 review-image">
            </div>
          </el-collapse-item>
          <div
            class="applicant--incosistency-mark"
            v-if="verification_details.car_insurance_validity.inconsistency"
          >Marked for Data Inconsistency</div>
        </div>
        <div class="applicant--details-wrap">
          <el-collapse-item
            name="6"
            :class="verification_details.kra_pin_verification.inconsistency? 'inconsistent-collapse':''"
            class="verification-wrap"
>
            <template slot="title">
              <span>Good Conduct Certificate Verification</span>
            </template>
              <el-form :model="verification_details.good_conduct_verification" v-show="!goodConductReview">
                <el-form-item label="Reference Number">
                  <el-input v-model="verification_details.good_conduct.reference_number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Date Issued">
                  <el-date-picker v-model="verification_details.good_conduct.date_of_issue" auto-complete="off" type="date" popper-class="date-popup" placeholder="Date Issued"></el-date-picker>
                </el-form-item>
                <el-form-item label="Number of offences">
                  <br />
                  <el-input-number v-model="verification_details.good_conduct.number_of_offences" auto-complete="off" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" class="details-save-button" @click="updateReview('good_conduct', 'good_conduct')">SAVE</el-button>
                </el-form-item>
              </el-form>
            <div class="el-col-lg-15 review-details" v-show="goodConductReview">
              <div class="el-row">
                <div class="review-title">Reference Number</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.good_conduct.reference_number }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Date Issued</div>
                <div class="review-desc">{{ this.verification_details.good_conduct.date_of_issue }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Number of Offences</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.good_conduct.number_of_offences }}</div>
              </div>
            </div>
            <div class="el-col-lg-7 review-image">

            </div>
          </el-collapse-item>
          <div
            class="applicant--incosistency-mark"
            v-if="verification_details.kra_pin_verification.inconsistency"
          >Marked for Data Inconsistency</div>
        </div>
         <div class="applicant--details-wrap" v-show="applicant_details.application_type !== 'Driver'">
          <el-collapse-item
            name="7"
            :class="verification_details.kra_pin_verification.inconsistency? 'inconsistent-collapse':''"
            class="verification-wrap"
>
            <template slot="title">
              <span>{{ taxPayerNameIdentifier }} Verification</span>
            </template>

            <el-form :model="verification_details.kra_pin_verification" v-show="!kraReview">
              <el-form-item label="Validity" :label-width="'25%'">
                <el-input
                  v-model="verification_details.kra_pin_verification.validity"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="Name" :label-width="'25%'">
                <el-input
                  v-model="verification_details.kra_pin_verification.name"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="PIN/TIN Number" :label-width="'25%'">
                <el-input
                  v-model="verification_details.kra_pin_verification.pin_number"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="Tax Obligations" :label-width="'25%'">
                <el-input
                  v-model="verification_details.kra_pin_verification.tax_obligations"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="Date of Registration" :label-width="'25%'">
                <el-date-picker
                  v-model="verification_details.kra_pin_verification.registration_date"
                  type="date"
                  popper-class="date-popup"
                  placeholder="Date of Registration"
                ></el-date-picker>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  class="details-save-button"
                  @click="updateReview('kra_pin_verification', `${taxPayerNameIdentifier} Verification`)"
                >SAVE</el-button>
              </el-form-item>
            </el-form>

            <div class="el-col-lg-15 review-details" v-show="kraReview">
              <div class="el-row">
                <div class="review-title">Validity</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.kra_pin_verification.validity }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Name</div>
                <div class="review-desc">{{ this.verification_details.kra_pin_verification.name }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">{{ taxPayerNameIdentifier }}</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.kra_pin_verification.pin_number }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Tax Obligations</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.kra_pin_verification.tax_obligations }}</div>
              </div>
              <div class="el-row">
                <div class="review-title">Date of Registration</div>
                <div
                  class="review-desc"
                >{{ formatDate(this.verification_details.kra_pin_verification.registration_date) }}</div>
              </div>
            </div>
            <div class="el-col-lg-7 review-image">
            </div>
          </el-collapse-item>
          <div
            class="applicant--incosistency-mark"
            v-if="verification_details.kra_pin_verification.inconsistency"
          >Marked for Data Inconsistency</div>
        </div>
      </el-collapse>
     </div>
    </div>
  </div>
</template>

<script>
import DetailMxn from '../../mixins/detail_mixin';
import TimezoneMxn from '../../mixins/timezone_mixin';
import errorHandler from '../errorHandler.vue';

export default {
  name: 'applicant-details',
  components: { errorHandler },
  mixins: [DetailMxn, TimezoneMxn],
  props: ['data', 'docs'],
  data() {
    return {
      vendor_types: VENDOR_TYPES,
      comments: '',
      popover_visible: false,
      reason: '',
      lock_ui: false,
      valid_docs: [],
      invalid_docs: [],
      current_verification: this.$store.getters.current_verification,
      applicant_details: {},
      verification_details: {},
      accordionActiveName: 'identity_check',
      id_card: '',
      id_doc_change: false,
      nok_doc_change: false,
      AWS_URL: window.AWS_URL,
      applicant_review: {
        status: '',
        reason: '',
      },
      user: JSON.parse(localStorage.user),
      partner_logs: [],
      showHoverVal: 0,
      errorObj: '',
    };
  },
  computed: {
    identityReview() {
      return this.verification_details.identity_check.review_status;
    },
    drivingReview() {
      return this.verification_details.driving_license_check.review_status;
    },
    motorReview() {
      return this.verification_details.motor_vehicle_records_check.review_status;
    },
    insuranceReview() {
      return this.verification_details.car_insurance_validity.review_status;
    },
    kraReview() {
      return this.verification_details.kra_pin_verification.review_status;
    },
    goodConductReview() {
      return this.verification_details.good_conduct.review_status;
    },
    validSubmit() {
      return this.checkReviewStatus();
    },
    validSubmitStatus() {
      if (this.applicant_review.status === '') {
        return false;
      } else {
        if (!this.applicant_review.status) {
          if (this.applicant_review.reason === '') {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
    },

    taxPayerNameIdentifier() {
      if ('country' in this.applicant_details) {
        if (this.applicant_details.country === 'Kenya') {
          return 'KRA PIN';
        }
      }
      return 'TIN';
    },
  },
  watch: {},
  beforeMount() {
    this.applicant_details = this.current_verification.applicant_details;
    this.verification_details = this.current_verification.verification_details;
    this.getPartnerLogs();
  },
  methods: {
    async updateReview(field, field_title = '') {
      // update store
      const verification = {
        applicant_details: this.applicant_details,
        verification_details: this.verification_details,
      };

      const review_json = this.verification_details[field];
      const properties_res = this.checkProperties(review_json);

      if (properties_res) {
        review_json['review_status'] = true;
      } else {
        review_json['review_status'] = false;
      }

      if (field === 'identity_check') {
        // check if upload happened
        if (this.id_doc_change) {
          // perform upload
          const upload_res = await this.uploadDocument('id_card');

          if (!upload_res) {
            review_json['id_card'] = upload_res;
            const obj = this.verification_details;
            obj['identity_check']['id_card'] = upload_res;
            this.verification_details = Object.assign({}, this.verification_details, obj);
          }
        }
      }

      // update db

      const payload = {
        review_section: field,
        review_json: JSON.stringify(review_json),
        partner_id: this.applicant_details.partner_id,
        partner_id_no: this.applicant_details.id_no,
        admin_id: JSON.parse(localStorage.user).admin_id,
        admin_name: JSON.parse(localStorage.user).name,
      };

      axios
        .post(`${AUTH_URL}rider/admin_partner_api/v5/peleza/applications/update_review/`, JSON.stringify(payload), { headers: { 'Content-Type': 'application/json;charset=UTF-8', Authorization: localStorage.token } })
        .then(response => {
          if (response.data.status) {
            this.$notify.success({
              title: `update ${field_title}`,
              message: `applicant ${field_title} updated successfully`,
            });
            this.$store.commit('changeVerification', verification);
          } else {
            this.$notify.error({
              title: `update ${field_title}`,
              message: `applicant ${field_title} failed to update`,
            });
          }
        })
        .catch(error => {
          this.errorObj = error.response;
          this.$notify.error({
            title: `update ${field_title}`,
            message: `applicant ${field_title} failed to update`,
          });
          throw new Error('Could not update applicant');
        });

      this.getPartnerLogs();
    },
    async uploadDocument(doc_id) {
      const data = new FormData();
      const files = document.getElementById(doc_id)['files'];

      if (!files.length) {
        return false;
      }

      const file = files[0];
      data.append(doc_id, file);

      const fileName = this.sanitizeFilename(file.name);
      const albumPhotosKey = `${encodeURIComponent(this.getAlbumName(doc_id))}/`;
      const photoKey = `${albumPhotosKey}${fileName}`;

      data.append('key', photoKey);
      data.append('field_name', doc_id);
      data.append('album', albumPhotosKey);

      const headers = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };

      return (
        axios
          .post(`${AUTH_URL}rider/admin_partner_api/v5/peleza/upload_doc/`, data, { headers: { 'content-type': 'multipart/form-data', Authorization: localStorage.token } })
          .then(response => response.data.file_name)
          .catch(err => {
            this.errorObj = err.response;
            return false;
          })
      );
    },
    handleBack() {
      this.$router.push({ name: 'inconsistencies' });
    },
    sanitizeFilename(name) {
      const temp_name = new Date().getTime() + name.toLowerCase().replace(/\s/g, '');
      return temp_name;
    },
    getAlbumName(iid) {
      if (iid === 'insurance') {
        return 'insu';
      } else if (iid === 'id_card' || iid === 'nok_id_card') {
        return 'id';
      } else if (iid === 'driver') {
        return 'photo';
      } else {
        return iid;
      }
    },
    handleIdCardChange() {
      const files = document.getElementById('id_card')['files'];

      if (files.length < 1) {
        this.id_doc_change = false;
      } else {
        this.id_doc_change = true;
        const name = files[0]['name'];

        const obj = this.verification_details;
        obj['identity_check']['id_card'] = name;
        this.verification_details = Object.assign({}, this.verification_details, obj);
      }
    },

    checkReviewStatus() {
      const obj = this.verification_details;
      for (const key in obj) {
        if (obj[key]['review_status'] === false) {
          return false;
        }
      }
      return true;
    },
    printInsurance() {
      const prtHtml = document.getElementById('print').innerHTML;
      let stylesHtml = '';
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML;
      }
      const WinPrint = window.open('', '', 'left=0,top=0,margin-top=30000px,width=800,height=900,toolbar=0,scrollbars=0,status=0');
      WinPrint.document.write(`<!DOCTYPE html>
      <html>
        <head>
          ${stylesHtml}
        </head>
        <body>
          ${prtHtml}
        </body>
      </html>`);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    },
    showDets(val) {
      this.showHoverVal = val;
    },
  },
};
</script>
<style>
@import '../../assets/style/detail.css';
@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }
}
</style>
