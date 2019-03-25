<template>
  <div class="applicant-details">
    <div class="applicant-details__back" @click="handleBack">
      <img src="../../assets/left-arrow.png" class="applicant-details__back_image">
      <div class="applicant-details__back_text">Back</div>
    </div>
    <div class="applicant-details__profile">
      <el-card class="applicant-details__profile__personal-details">
        <div class="applicant-details__profile_content">
          <img :src="applicant_details.driver_photo" class="applicant-details__profile_image">

          <div class="applicant-details__profile_row">
            <div class="applicant-details__profile_label">ID NUMBER</div>
            <div class="applicant-details__profile_value">{{ applicant_details.id_no }}</div>
          </div>

          <div class="applicant-details__profile_row">
            <div class="applicant-details__profile_label">KRA PIN</div>
            <div class="applicant-details__profile_value">{{ applicant_details.kra_pin }}</div>
          </div>
          <div class="applicant-details__profile_row">
            <div class="applicant-details__profile_label">DATE OF APPLICATION</div>
            <div
              class="applicant-details__profile_value"
            >{{ formatDate(applicant_details.date_created) }}</div>
          </div>

          <div class="applicant-details__profile_row">
            <div class="applicant-details__profile_label">APPLICATION TYPE</div>
            <div class="applicant-details__profile_value">{{ applicant_details.application_type }}</div>
          </div>

          <div class="applicant-details__profile_row">
            <div class="applicant-details__profile_label">VENDOR TYPE</div>
            <div
              class="applicant-details__profile_value"
            >{{ getVendorType(applicant_details.vendor_type) }}</div>
          </div>

          <div class="applicant-details__profile_row">
            <div class="applicant-details__profile_label">STATUS</div>
            <div class="applicant-details__profile_value">Applied</div>
          </div>
        </div>
      </el-card>

      <el-card
        header="Submit Applicant"
        class="applicant-details__submit-review"
        v-if="validSubmit"
      >
        <el-form>
          <el-form-item>
            <select
              v-model="applicant_review.status"
              auto-complete="off"
              placeholder
              class="review-select"
            >
              <option value disabled selected>Review Applicant</option>
              <option value="1" label="Recommended"></option>
              <option value="0" label="Not Recommended"></option>
            </select>
          </el-form-item>

          <el-form-item v-show="applicant_review.status === 0 && applicant_review.status !== ''">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="Reason"
              class="review-reason"
              v-model="applicant_review.reason"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="submit-review-button"
              @click="submitApplicantReview"
              :disabled="!validSubmitStatus"
            >SUBMIT</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card
        header="Data Inconsistency"
        class="applicant-details__submit-review"
        v-if="inconsistencyCheck"
      >
        <el-alert
          :title="inconsistency_alert_message"
          type="warning"
          :closable="false"
          v-if="inconsistency_alert_status"
        ></el-alert>
        <el-form>
          <el-form-item>
            <el-input
              type="textarea"
              :rows="4"
              placeholder="Reason"
              class="review-reason"
              v-model="inconsistency_message"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitDataInconsistency"
              :class="validInconsistency ? 'submit-review-button' : 'submit-review-button-disabled'"
            >SUBMIT</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card
        header="Activity Log"
        class="applicant-details__profile__personal-details"
        v-show="partner_logs.length > 0"
      >
        <ul class="logs-list">
          <li v-for="log in partner_logs.slice().reverse()" :key="log">{{ createLogStatement(log) }}</li>
        </ul>
      </el-card>
    </div>
    <div class="applicant-details__data">
      <el-collapse v-model="accordionActiveName">
        <div class="applicant--details-wrap">
          <el-collapse-item name="1">
            <template slot="title">
              <span style>Identity Check</span>

              <span class="applicant-details__idNo">ID Number : {{ applicant_details.id_no }}</span>
            </template>
            <el-form :model="verification_details.identity_check" v-show="!identityReview">
              <el-form-item label="Name of Applicant" :label-width="'25%'">
                <el-input
                  v-model="verification_details.identity_check.applicant_name"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="Date of Birth" :label-width="'25%'">
                <el-date-picker
                  v-model="verification_details.identity_check.dob"
                  type="date"
                  popper-class="date-popup"
                  placeholder="Date of Birth"
                ></el-date-picker>
              </el-form-item>

              <el-form-item label="Place of Birth" :label-width="'25%'">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="verification_details.identity_check.pob"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="Gender" :label-width="'25%'">
                <el-select v-model="verification_details.identity_check.gender" auto-complete="off">
                  <el-option value="Male">Male</el-option>
                  <el-option value="Female">Female</el-option>
                </el-select>
              </el-form-item>

              <!-- <el-form-item label="Attach Id Card" :label-width="'25%'">
                              <el-input v-model="verification_details.identity_check.id_card" auto-complete="off" class="upload-input"></el-input>
                              <input name="id_card" auto-complete="off" v-on:change="handleIdCardChange" class="upload-button inputfile" type="file" id="id_card"/>
                              <label for="id_card">Choose a file</label>
              </el-form-item>-->
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
                  <div class="el-row">
                    <div class="review-title">Date of Birth</div>
                    <div
                      class="review-desc"
                    >{{ formatDate(this.verification_details.identity_check.dob) }}</div>
                  </div>
                  <div class="el-row">
                    <div class="review-title">Place of Birth</div>
                    <div class="review-desc">{{ this.verification_details.identity_check.pob }}</div>
                  </div>
                  <div class="el-row">
                    <div class="review-title">Gender</div>
                    <div class="review-desc">{{ this.verification_details.identity_check.gender }}</div>
                  </div>
                </div>
                <div class="el-col-lg-8 review-image">
                  <div class="review-edit" @click="handleReviewEdit('identity_check')">Edit</div>
                  <!-- <a :href="`${AWS_URL}id/${verification_details.identity_check.id_card}`" target="_blank">
                                    <img :src="`${AWS_URL}id/${verification_details.identity_check.id_card}`"/>
                  </a>-->
                </div>
              </div>
            </div>
          </el-collapse-item>
          <el-form class="applicant--incosistency-wrap">
            <el-form-item>
              <el-checkbox
                v-model="verification_details.identity_check.inconsistency"
                id="identity_inconsistency"
                name="identity_inconsistency"
              ></el-checkbox>Mark for Data Inconsistency
            </el-form-item>
          </el-form>
        </div>
        <div
          class="applicant--details-wrap"
          v-show="applicant_details.application_type !== 'Owner'"
        >
          <el-collapse-item title="Driving License Check" name="3">
            <el-form :model="verification_details.driving_license_check" v-if="!drivingReview">
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
                  popper-class="date date- date-popup"
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
                <div class="review-edit" @click="handleReviewEdit('driving_license_check')">Edit</div>
              </div>
            </div>
          </el-collapse-item>
          <el-form class="applicant--incosistency-wrap">
            <el-form-item>
              <el-checkbox
                v-model="verification_details.driving_license_check.inconsistency"
                name="driving_license_inconsistency"
                id="driving_license_inconsistency"
              ></el-checkbox>Mark for Data Inconsistency
            </el-form-item>
          </el-form>
        </div>
        <div
          class="applicant--details-wrap"
          v-show="applicant_details.application_type !== 'Driver'"
        >
          <el-collapse-item name="4">
            <template slot="title">
              <span>Motor Vehicle Records Check</span>
              <span
                class="applicant--details__noPlate"
              >Number Plate : {{ applicant_details.vehicle_reg_no }}</span>
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
                <div class="review-title">KRA Pin Number of Owner</div>
                <div
                  class="review-desc"
                >{{ this.verification_details.motor_vehicle_records_check.owner_kra }}</div>
              </div>
            </div>
            <div class="el-col-lg-8 review-image">
              <div
                class="review-edit"
                v-show="motorReview"
                @click="handleReviewEdit('motor_vehicle_records_check')"
              >Edit</div>
            </div>
          </el-collapse-item>
          <el-form class="applicant--incosistency-wrap">
            <el-form-item>
              <el-checkbox
                v-model="verification_details.motor_vehicle_records_check.inconsistency"
                name="motor_vehicle_inconsistency"
                id="motor_vehicle_inconsistency"
              ></el-checkbox>Mark for Data Inconsistency
            </el-form-item>
          </el-form>
        </div>
        <div
          class="applicant--details-wrap"
          v-show="applicant_details.application_type !== 'Driver'"
        >
          <el-collapse-item name="5">
            <template slot="title">
              <span>Car Insurance Validity</span>
              <span
                class="applicant--details__insurance"
              >Insurance Number : {{ applicant_details.insurance_number }}</span>
            </template>
            <el-form
              :model="verification_details.car_insurance_validity"
              class="el-col-lg-24 review-details"
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
              <div
                class="review-edit applicant-edit2"
                @click="handleReviewEdit('car_insurance_validity')"
                v-show="insuranceReview"
              >Edit</div>
              <!--<a :href="`${AWS_URL}insu/${this.applicant_details.insurance_copy}`" target="_blank">
                <img :src="`${AWS_URL}insu/${this.applicant_details.insurance_copy}`">
              </a>-->
            </div>
          </el-collapse-item>
          <el-form class="applicant--incosistency-wrap">
            <el-form-item>
              <el-checkbox
                v-model="verification_details.car_insurance_validity.inconsistency"
                name="insurance_inconsistency"
                id="insurance_inconsistency"
              ></el-checkbox>Mark for Data Inconsistency
            </el-form-item>
          </el-form>
        </div>
        <div
          class="applicant--details-wrap"
          v-show="applicant_details.application_type !== 'Driver'"
        >
          <el-collapse-item name="6">
            <template slot="title">
              <span>KRA PIN Verification</span>
              <span
                class="applicant--details__kraPin"
              >KRA PIN NUMBER : {{ applicant_details.kra_pin }}</span>
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

              <el-form-item label="Pin Number" :label-width="'25%'">
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
                  @click="updateReview('kra_pin_verification', 'KRA Pin Verification')"
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
                <div class="review-title">Pin Number</div>
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
              <div
                class="review-edit"
                @click="handleReviewEdit('kra_pin_verification')"
                v-show="kraReview"
              >Edit</div>
            </div>
          </el-collapse-item>
          <el-form class="applicant--incosistency-wrap">
            <el-form-item>
              <el-checkbox
                v-model="verification_details.kra_pin_verification.inconsistency"
                name="kra_pin_inconsistsency"
                id="kra_pin_inconsistency"
              ></el-checkbox>Mark for Data Inconsistency
            </el-form-item>
          </el-form>
        </div>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import DetailMxn from '../../mixins/detail_mixin';

export default {
  name: 'applicant-details',
  mixins: [DetailMxn],
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
      inconsistency_message: '',
      inconsistency_alert_status: false,
      inconsistency_alert_message: '',
    };
  },
  computed: {
    inconsistencyCheck() {
      const obj = this.verification_details;
      for (const key in obj) {
        if (obj[key] != null && obj[key]['inconsistency'] === true) {
          return true;
        }
      }
      return false;
    },
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
    validInconsistency() {
      return this.inconsistencyCheck && this.inconsistency_message !== '' && this.checkReviewStatus();
    },
    validSubmit() {
      return this.checkReviewStatus() && !this.inconsistencyCheck;
    },
    validSubmitStatus() {
      if (this.applicant_review.status === '') {
        return false;
      } else {
        if (this.applicant_review.status === false) {
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
  },
  watch: {},
  beforeMount() {
    this.applicant_details = this.current_verification.applicant_details;
    this.verification_details = this.current_verification.verification_details;
    this.updateRecordNulls();
    this.getPartnerLogs();
  },
  methods: {
    updateRecordNulls() {
      if (this.verification_details.driving_license_check === null) {
        this.verification_details.driving_license_check = {
          applicant_name: '',
          dl_no: '',
          date_of_issue: '',
          expiry_date: '',
          classes: '',
          id_no: '',
          review_status: this.applicant_details.application_type === 'Owner',
          inconsistency: false,
        };
      }
      if (this.verification_details.kra_pin_verification === null) {
        this.verification_details.kra_pin_verification = {
          validity: '',
          name: '',
          pin_number: '',
          tax_obligations: '',
          registration_date: '',
          review_status: false,
          inconsistency: false,
        };
      }
      if (this.verification_details.car_insurance_validity === null) {
        this.verification_details.car_insurance_validity = {
          owner_name: '',
          vehicle_number_plate: '',
          issue_date: '',
          expiry_date: '',
          validity: '',
          policy_number: '',
          insurance_cert_number: '',
          review_status: this.applicant_details.application_type === 'Driver',
          inconsistency: false,
        };
      }
      if (this.verification_details.motor_vehicle_records_check === null) {
        this.verification_details.motor_vehicle_records_check = {
          ownership_details: '',
          chasis_no: '',
          make: '',
          body_type: '',
          engine_no: '',
          manufacture_year: '',
          caveats: '',
          review_status: this.applicant_details.application_type === 'Driver',
          inconsistency: false,
        };
      }
      if (this.verification_details.criminal_records_check === null) {
        this.verification_details.criminal_records_check = {
          applicant_name: '',
          criminal_history: '',
          authenticity: '',
          id_no: '',
          ref_no: '',
          review_status: true,
          inconsistency: false,
        };
      }
      if (this.verification_details.identity_check === null) {
        this.verification_details.identity_check = {
          applicant_name: '',
          dob: '',
          pob: '',
          gender: '',
          review_status: false,
          inconsistency: false,
        };
      }
    },
    async updateReview(field, field_title = '') {
      // update store
      const verification = {
        applicant_details: this.applicant_details,
        verification_details: this.verification_details,
      };

      const review_json = this.verification_details[field];
      const properties_res = this.checkProperties(review_json);

      if (properties_res === true) {
        review_json['review_status'] = true;
      } else {
        review_json['review_status'] = false;
      }

      if (field === 'identity_check') {
        // check if upload happened
        if (this.id_doc_change === true) {
          // perform upload
          const upload_res = await this.uploadDocument('id_card');

          if (upload_res !== false) {
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
        .post(`${PARTNER_BASE_URL}peleza/applications/update_review/`, JSON.stringify(payload))
        .then(response => {
          console.log(response);
          if (response.data.status === true) {
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

      return axios
        .post(`${PARTNER_BASE_URL}peleza/upload_doc/`, data, headers)
        .then(response => response.data.file_name)
        .catch(err => {
          console.error(err);
          return false;
        });
    },
    handleBack() {
      this.$router.push({ name: 'applications' });
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
      if (this.applicant_details.application_type === 'Driver') {
        return this.identityReview && this.drivingReview;
      } else if (this.applicant_details.application_type === 'Owner') {
        return this.identityReview && this.motorReview && this.insuranceReview && this.kraReview;
      } else if (this.applicant_details.application_type === 'Driver and owner') {
        return this.identityReview && this.motorReview && this.insuranceReview && this.kraReview && this.drivingReview;
      } else {
        const obj = this.verification_details;
        for (const key in obj) {
          if (obj[key] !== null && obj[key]['review_status'] === false) {
            return false;
          }
        }
        return true;
      }
    },

    submitApplicantReview() {
      const payload = {
        partner_id: this.applicant_details.partner_id,
        applicant_review: this.applicant_review,
        admin_id: JSON.parse(localStorage.user).admin_id,
        admin_name: JSON.parse(localStorage.user).name,
      };
      axios
        .post(`${PARTNER_BASE_URL}peleza/applications/submit_applicant_review/`, JSON.stringify(payload))
        .then(response => {
          if (response.data.status === true) {
            this.$notify.success({
              title: 'submit applicant review',
              message: response.data.message,
            });
            this.handleBack();
          } else {
            this.$notify.error({
              title: 'submit applicant review',
              message: response.data.message,
            });
          }
        })
        .catch(error => {
          this.$notify.error({
            title: 'submit applicant review',
            message: 'failed to update applicant review',
          });
          throw new Error('Could not update applicant');
        });
      this.getPartnerLogs();
    },
    submitDataInconsistency() {
      // change status of application to inconsistency
      // mark the sections to inconsistency
      // send email to partner with reupload link
      this.inconsistency_alert_status = false;
      this.inconsistency_alert_message = '';
      // reset alert status

      if (!this.validInconsistency) {
        // break
        // check if message is set
        if (!this.validSubmitStatus) {
          this.inconsistency_alert_message = 'review all sections before you can submit inconsistency';
        } else {
          this.inconsistency_alert_message = 'include a detailed inconsistency message to guide the applicant';
        }
        this.inconsistency_alert_status = true;
        return 0;
      }

      const payload = {
        partner_id: this.applicant_details.partner_id,
        inconsistency_message: this.inconsistency_message,
        verification_details: this.verification_details,
        admin_id: JSON.parse(localStorage.user).admin_id,
        admin_name: JSON.parse(localStorage.user).name,
      };
      axios
        .post(`${PARTNER_BASE_URL}peleza/applications/submit_data_inconsitency/`, JSON.stringify(payload))
        .then(response => {
          if (response.data.status === true) {
            this.$notify.success({
              title: 'submit data inconsistency',
              message: response.data.message,
            });
            this.handleBack();
          } else {
            this.$notify.error({
              title: 'submit data inconsistency',
              message: response.data.message,
            });
          }
        })
        .catch(error => {
          this.$notify.error({
            title: 'submit applicant review',
            message: 'failed to update applicant data inconsistency',
          });
          throw new Error('Could not update applicant data inconsistency');
        });

      this.getPartnerLogs();
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
  },
};
</script>
<style>
@import '../../assets/style/detail.css';
@import '../../assets/style/overide.css';
@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }
}
</style>
