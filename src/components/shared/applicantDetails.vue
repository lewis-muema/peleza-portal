<template>
  <div class="applicant-details" v-if="!loading">
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="applicant-details__profile">
      <div class="applicant-details-holder">
        <el-card class="applicant-details__profile__personal-details">
          <el-button type="primary back-button" @click="handleBack"><i class="fa fa-arrow-left el-icon-right back-icon"></i> Back to List</el-button>
          <div class="applicant-details__profile_content">
            <div class="applicant-details__application_type">Application Type</div>
            <div class="applicant-details__application_type_value">{{ applicant_details.application_type }}</div>
          </div>
          <div class="applicant-details__profile_content">
            <div class="applicant-details__application_type applicant-name">{{ capitalizeFirstLetter(applicant_details.applicant_username) }}</div>
            <div class="applicant-details__application_type_identity">
              <span>{{ applicant_details.id_no }}</span>
              <span class="identity-label">National ID</span>
            </div>
            <div class="applicant-details__application_type_identity">
              <span>{{ applicant_details.kra_pin !== null ? applicant_details.kra_pin : 'N/A' }}</span>
              <span class="identity-label">{{ taxPayerNameIdentifier }} Number</span>
            </div>
            <div class="applicant-details__application_type_identity text-uppercase ">{{ applicant_details.partner_country }}</div>
          </div>
          <div class="applicant-details__profile_content" v-if="applicant_details.application_type !== 'Owner'">
            <div class="applicant-details__application_date">
              <span class="applicant-vehicle">{{ getVendorType(applicant_details.vendor_type) }}</span>
              <span>{{ applicant_details.vehicle_reg_no !== '' ? applicant_details.vehicle_reg_no : 'N/A' }}</span>
              <span class="identity-label">Assigned Vehicle</span>
            </div>
          </div>
          <div class="applicant-details__profile_content">
            <div class="applicant-details__application_date">
              <span>{{ formatDate(applicant_details.date_created) }}</span>
              <span class="identity-label">Application Date</span>
            </div>
          </div>
          <el-button type="primary status-button" :class="getApplicantStatus(category)"> {{ getApplicantStatus(category) }}</el-button>
          <el-card header="Submit Applicant" class="applicant-details__submit-review" v-if="validSubmit">
            <el-form>
              <el-form-item>
                <el-select v-model="applicant_review.status" placeholder="Please select" clearable class="select-review">
                  <el-option v-for="item in recommendationOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>

              <el-form-item v-show="applicant_review.status === 0 && applicant_review.status !== ''">
                <el-input type="textarea" :rows="4" placeholder="Reason" class="review-reason" v-model="applicant_review.reason"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="submit-review-button" @click="submitApplicantReview" :disabled="!validSubmitStatus">Submit</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card header="Data Inconsistency" class="applicant-details__submit-review" v-if="(inconsistencyCheck && current_route === 'applicant') || (inconsistencyCheck && current_route === 'driver')">
            <el-alert :title="inconsistency_alert_message" type="warning" :closable="false" v-if="inconsistency_alert_status"></el-alert>
            <el-form>
              <el-form-item>
                <el-input type="textarea" :rows="4" placeholder="Reason" class="review-reason" v-model="inconsistency_message"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitDataInconsistency" :class="validInconsistency ? 'submit-review-button' : 'submit-review-button-disabled'">Submit</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card header="Data Inconsistency" class="applicant-details__inconsistency-messsage-wrap" v-if="applicant_details.inconsistency_message.length > 0">
            <div class="applicant-details__inconsistency-message">{{ capitalizeFirstLetter(applicant_details.inconsistency_message) }}</div>
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
            <el-collapse-item name="1" class="verification-wrap" :class="verification_details.identity_check.inconsistency && current_route === 'inconsistency' ? 'inconsistency-header' : ''">
              <template slot="title">
                <span>National Identity Check</span>
                <span class="marked-inconsistent" v-if="verification_details.identity_check.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
                <span class="applicant-details__idNo" @mouseover="showDets(1)" @mouseout="showDets(0)"> ID Number : {{ applicant_details.id_no }} </span>
                <span class="hidden-hover" v-if="showHoverVal === 1">ID Number : {{ applicant_details.id_no }}</span>
              </template>
              <el-form :model="verification_details.identity_check" v-show="!identityReview">
                <el-form-item label="Name of Applicant">
                  <el-input v-model="verification_details.identity_check.applicant_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Date of Birth">
                  <el-date-picker v-model="verification_details.identity_check.dob" type="date" popper-class="date-popup" placeholder="Date of Birth"></el-date-picker>
                </el-form-item>

                <el-form-item label="Place of Birth">
                  <el-input type="textarea" :rows="4" v-model="verification_details.identity_check.pob" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Gender">
                  <el-select v-model="verification_details.identity_check.gender" auto-complete="off">
                    <el-option value="Male">Male</el-option>
                    <el-option value="Female">Female</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" class="details-save-button" @click="updateReview('identity_check', 'Identity Check')">SAVE</el-button>
                </el-form-item>
              </el-form>
              <div class="review_wrap" v-show="verification_details.identity_check.review_status">
                <div class="el-row">
                  <div class="el-col-lg-16 review-details">
                    <div class="el-row">
                      <div class="review-title">Name of Applicant</div>
                      <div class="review-desc">{{ this.verification_details.identity_check.applicant_name }}</div>
                    </div>
                    <div class="el-row">
                      <div class="review-title">Date of Birth</div>
                      <div class="review-desc">{{ formatDate(this.verification_details.identity_check.dob) }}</div>
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
                  </div>
                </div>
              </div>
              <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant">
                <el-form-item> <el-checkbox v-model="verification_details.identity_check.inconsistency" id="identity_inconsistency" name="identity_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
              </el-form>
              <div class="applicant--incosistency-mark" v-if="verification_details.identity_check.inconsistency && current_route === 'inconsistency'">
                Marked for Data Inconsistency
              </div>
            </el-collapse-item>
          </div>
          <div class="applicant--details-wrap" v-if="applicant_details.application_type !== 'Owner'">
            <el-collapse-item title="" class="verification-wrap" :class="verification_details.driving_license_check.inconsistency && current_route === 'inconsistency' ? 'inconsistency-header' : ''" name="3">
              <template slot="title">
                <span>Driving License Check</span>
                <span class="marked-inconsistent" v-if="typeof verification_details !== 'undefined' && verification_details.driving_license_check.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
              </template>
              <el-form :model="verification_details.driving_license_check" v-if="!drivingReview">
                <el-form-item label="Name of Applicant">
                  <el-input v-model="verification_details.driving_license_check.applicant_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="DL Number">
                  <el-input v-model="verification_details.driving_license_check.dl_no" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Date of Issue">
                  <el-date-picker v-model="verification_details.driving_license_check.date_of_issue" type="date" popper-class="date date- date-popup" placeholder="Date of Issue"></el-date-picker>
                </el-form-item>
                <el-form-item label="Expiry Date">
                  <el-date-picker v-model="verification_details.driving_license_check.expiry_date" type="date" popper-class="date-popup" placeholder="Expiry Date"></el-date-picker>
                </el-form-item>
                <el-form-item label="Classes">
                  <el-input v-model="verification_details.driving_license_check.classes" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Id Number">
                  <el-input v-model="verification_details.driving_license_check.id_no" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" class="details-save-button" @click="updateReview('driving_license_check', 'Driving License Check')">SAVE</el-button>
                </el-form-item>
              </el-form>
              <div class="el-row" v-show="drivingReview">
                <div class="el-col-lg-16 review-details">
                  <div class="el-row">
                    <div class="review-title">Name of Applicant</div>
                    <div class="review-desc">{{ this.verification_details.driving_license_check.applicant_name }}</div>
                  </div>
                  <div class="el-row">
                    <div class="review-title">DL Number</div>
                    <div class="review-desc">{{ this.verification_details.driving_license_check.dl_no }}</div>
                  </div>
                  <div class="el-row">
                    <div class="review-title">Date of Issue</div>
                    <div class="review-desc">{{ formatDate(this.verification_details.driving_license_check.date_of_issue) }}</div>
                  </div>
                  <div class="el-row">
                    <div class="review-title">Expiry Date</div>
                    <div class="review-desc">{{ formatDate(this.verification_details.driving_license_check.expiry_date) }}</div>
                  </div>
                  <div class="el-row">
                    <div class="review-title">Classes</div>
                    <div class="review-desc">{{ this.verification_details.driving_license_check.classes }}</div>
                  </div>
                  <div class="el-row">
                    <div class="review-title">ID Number</div>
                    <div class="review-desc">{{ this.verification_details.driving_license_check.id_no }}</div>
                  </div>
                </div>
                <div class="el-col-lg-8 review-image">
                  <div class="review-edit" @click="handleReviewEdit('driving_license_check')">Edit</div>
                </div>
              </div>
              <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant">
                <el-form-item> <el-checkbox v-model="verification_details.driving_license_check.inconsistency" name="driving_license_inconsistency" id="driving_license_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
              </el-form>
              <div class="applicant--incosistency-mark" v-if="verification_details.driving_license_check.inconsistency && current_route === 'inconsistency'">
                Marked for Data Inconsistency
              </div>
            </el-collapse-item>
          </div>
          <div class="applicant--details-wrap" v-show="applicant_details.application_type !== 'Driver'">
            <el-collapse-item class="verification-wrap" :class="verification_details.motor_vehicle_records_check.inconsistency && current_route === 'inconsistency' ? 'inconsistency-header' : ''" name="4">
              <template slot="title">
                <span>Motor Vehicle Records Check</span>
                <span class="marked-inconsistent" v-if="verification_details.motor_vehicle_records_check.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
                <span class="applicant--details__noPlate" @mouseover="showDets(2)" @mouseout="showDets(0)"> Number Plate : {{ applicant_details.vehicle_reg_no }} </span>
                <span class="hidden-hover" v-if="showHoverVal === 2">Number Plate : {{ applicant_details.vehicle_reg_no }}</span>
              </template>

              <el-form :model="verification_details.motor_vehicle_records_check" v-show="!motorReview">
                <el-form-item label="Ownership Details and Address">
                  <el-input type="textarea" :rows="4" v-model="verification_details.motor_vehicle_records_check.ownership_details" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Vehicle Make">
                  <el-input v-model="verification_details.motor_vehicle_records_check.make" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Vehicle Body Type">
                  <el-input v-model="verification_details.motor_vehicle_records_check.body_type" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Engine No">
                  <el-input v-model="verification_details.motor_vehicle_records_check.engine_no" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Chasis No">
                  <el-input v-model="verification_details.motor_vehicle_records_check.chasis_no" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Year of Manufacture">
                  <el-date-picker v-model="verification_details.motor_vehicle_records_check.manufacture_year" type="month" popper-class="date-popup" placeholder="Year of Manufacture" @change="check_vendor_period"></el-date-picker>
                  <span class="input-error" v-if="vendorTypeAge > 24">* NOTE: Sendy only accepts Bikes that are less than 2 years</span>
                </el-form-item>

                <el-form-item label="Caveats">
                  <el-input v-model="verification_details.motor_vehicle_records_check.caveats" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" class="details-save-button" :disabled="isDisabled" @click="updateReview('motor_vehicle_records_check', 'Motor Vehicle Records Check')">SAVE</el-button>
                </el-form-item>
              </el-form>

              <div v-show="motorReview" class="el-col-lg-16 review-details">
                <div class="el-row">
                  <div class="review-title">Ownership Details and Address</div>
                  <div class="review-desc">{{ this.verification_details.motor_vehicle_records_check.ownership_details }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Vehicle Make</div>
                  <div class="review-desc">{{ this.verification_details.motor_vehicle_records_check.make }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Vehicle Body Type</div>
                  <div class="review-desc">{{ this.verification_details.motor_vehicle_records_check.body_type }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Engine No</div>
                  <div class="review-desc">{{ this.verification_details.motor_vehicle_records_check.engine_no }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Chasis No</div>
                  <div class="review-desc">{{ this.verification_details.motor_vehicle_records_check.chasis_no }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Year of Manufacture</div>
                  <div class="review-desc">
                    {{ formatYear(this.verification_details.motor_vehicle_records_check.manufacture_year) }}
                  </div>
                </div>
                <div class="el-row">
                  <div class="review-title">Caveats</div>
                  <div class="review-desc">{{ this.verification_details.motor_vehicle_records_check.caveats }}</div>
                </div>

                <div class="el-row">
                  <div class="review-title">{{ taxPayerNameIdentifier }} Number of Owner</div>
                  <div class="review-desc">{{ this.verification_details.motor_vehicle_records_check.owner_kra }}</div>
                </div>
              </div>
              <div class="el-col-lg-8 review-image">
                <div class="review-edit" v-show="motorReview" @click="handleReviewEdit('motor_vehicle_records_check')">Edit</div>
              </div>
              <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant">
                <el-form-item> <el-checkbox v-model="verification_details.motor_vehicle_records_check.inconsistency" name="motor_vehicle_inconsistency" id="motor_vehicle_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
              </el-form>
              <div class="applicant--incosistency-mark" v-if="verification_details.motor_vehicle_records_check.inconsistency && current_route === 'inconsistency'">
                Marked for Data Inconsistency
              </div>
            </el-collapse-item>
          </div>
          <div class="applicant--details-wrap" v-show="applicant_details.application_type !== 'Driver'">
            <el-collapse-item class="verification-wrap" :class="verification_details.car_insurance_validity.inconsistency && current_route === 'inconsistency' ? 'inconsistency-header' : ''" name="5">
              <template slot="title">
                <span>Car Insurance Validity</span>
                <span class="marked-inconsistent" v-if="verification_details.car_insurance_validity.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
                <span class="applicant--details__insurance" @mouseover="showDets(3)" @mouseout="showDets(0)"> Insurance Number : {{ applicant_details.insurance_number }} </span>
                <span class="hidden-hover" v-if="showHoverVal === 3"> Insurance Number : {{ applicant_details.insurance_number }} </span>
              </template>
              <el-form :model="verification_details.car_insurance_validity" class="el-col-lg-24 review-details" v-show="!insuranceReview">
                <div id="print" class="el-row" v-show="this.applicant_details.application_type !== 'Driver'">
                  <div class="review-consent-text">I, {{ this.applicant_details.partner_name }} (ID Number {{ this.applicant_details.id_no }}), {{ this.appendConsentText() }}</div>

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
                  <b class="insurance-subtitle">Authorization to verify Insurance Certificate: <span class="insurance-acceptance">Accepted</span></b>
                  <div class="no-print">
                    <el-button type="primary" class="details-print-button" @click="printInsurance">Print Authorisation</el-button>
                  </div>
                  <hr class="insurance-divider" />
                </div>
                <el-form-item label="Name of Owner">
                  <el-input v-model="verification_details.car_insurance_validity.owner_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Vehicle Number Plate">
                  <el-input v-model="verification_details.car_insurance_validity.vehicle_number_plate" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Issue Date">
                  <el-date-picker v-model="verification_details.car_insurance_validity.issue_date" type="date" popper-class="date-popup" placeholder="Issue Date"></el-date-picker>
                </el-form-item>

                <el-form-item label="Expiry Date">
                  <el-date-picker v-model="verification_details.car_insurance_validity.expiry_date" type="date" popper-class="date-popup" placeholder="Expiry Date"></el-date-picker>
                </el-form-item>

                <el-form-item label="Validity">
                  <el-input v-model="verification_details.car_insurance_validity.validity" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Policy Number">
                  <el-input v-model="verification_details.car_insurance_validity.policy_number" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Insurance Cert Number">
                  <el-input v-model="verification_details.car_insurance_validity.insurance_cert_number" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" class="details-save-button" @click="updateReview('car_insurance_validity', 'Car Insurance Validity Check')">SAVE</el-button>
                </el-form-item>
              </el-form>
              <div class="el-col-lg-24 review-details" v-show="insuranceReview">
                <div id="print" class="el-row" v-show="this.applicant_details.application_type !== 'Driver'">
                  <div class="review-consent-text">I, {{ this.applicant_details.partner_name }} (ID Number {{ this.applicant_details.id_no }}), {{ this.appendConsentText() }}</div>
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
                  <b class="insurance-subtitle">Authorization to verify Insurance Certificate: <span class="insurance-acceptance">Accepted</span></b>
                  <div class="no-print">
                    <el-button type="primary" class="details-print-button" @click="printInsurance">Print Authorisation</el-button>
                  </div>
                  <hr class="insurance-divider" />
                  <hr />
                </div>
                <div class="el-row">
                  <div class="review-title">Name of Owner</div>
                  <div class="review-desc">{{ this.verification_details.car_insurance_validity.owner_name }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Vehicle Number Plate</div>
                  <div class="review-desc">{{ this.verification_details.car_insurance_validity.vehicle_number_plate }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Issue Date</div>
                  <div class="review-desc">{{ formatDate(this.verification_details.car_insurance_validity.issue_date) }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Expiry Date</div>
                  <div class="review-desc">{{ formatDate(this.verification_details.car_insurance_validity.expiry_date) }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Validity</div>
                  <div class="review-desc">{{ this.verification_details.car_insurance_validity.validity }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Policy Number</div>
                  <div class="review-desc">{{ this.verification_details.car_insurance_validity.policy_number }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Insurance Cert Number</div>
                  <div class="review-desc">{{ this.verification_details.car_insurance_validity.insurance_cert_number }}</div>
                </div>
              </div>
              <div class="el-col-lg-7 review-image">
                <div class="review-edit applicant-edit2" @click="handleReviewEdit('car_insurance_validity')" v-show="insuranceReview">Edit</div>
              </div>
              <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant">
                <el-form-item> <el-checkbox v-model="verification_details.car_insurance_validity.inconsistency" name="insurance_inconsistency" id="insurance_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
              </el-form>
              <div class="applicant--incosistency-mark" v-if="verification_details.car_insurance_validity.inconsistency && current_route === 'inconsistency'">
                Marked for Data Inconsistency
              </div>
            </el-collapse-item>
          </div>
          <div class="applicant--details-wrap" v-show="applicant_details.application_type !== 'Owner' && applicant_details.vendor_type === '1'">
            <el-collapse-item class="verification-wrap" :class="verification_details.good_conduct.inconsistency && current_route === 'inconsistency' ? 'inconsistency-header' : ''" name="6">
              <template slot="title">
                <span>Certificate of Good Conduct</span>
                <span class="marked-inconsistent" v-if="verification_details.good_conduct.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
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
                  <div class="review-desc">{{ this.verification_details.good_conduct.reference_number }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Date Issued</div>
                  <div class="review-desc">{{ this.verification_details.good_conduct.date_of_issue }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Number of Offences</div>
                  <div class="review-desc">{{ this.verification_details.good_conduct.number_of_offences }}</div>
                </div>
              </div>
              <div class="el-col-lg-7 review-image">
                <div class="review-edit" @click="handleReviewEdit('good_conduct')" v-show="goodConductReview">Edit</div>
              </div>
              <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant">
                <el-form-item> <el-checkbox v-model="verification_details.good_conduct.inconsistency" name="kra_pin_inconsistsency" id="kra_pin_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
              </el-form>
              <div class="applicant--incosistency-mark" v-if="verification_details.good_conduct.inconsistency && current_route === 'inconsistency'">
                Marked for Data Inconsistency
              </div>
            </el-collapse-item>
          </div>
          <div class="applicant--details-wrap" v-show="applicant_details.application_type !== 'Driver'">
            <el-collapse-item class="verification-wrap" :class="verification_details.kra_pin_verification.inconsistency && current_route === 'inconsistency' ? 'inconsistency-header' : ''" name="7">
              <template slot="title">
                <span>{{ taxPayerNameIdentifier }} Verification</span>
                <span class="marked-inconsistent" v-if="verification_details.kra_pin_verification.inconsistency && current_route === 'inconsistency'">Marked for Inconsistencies</span>
                <span class="applicant--details__kraPin" @mouseover="showDets(4)" @mouseout="showDets(0)"> {{ taxPayerNameIdentifier }} NUMBER : {{ applicant_details.kra_pin }} </span>
                <span class="hidden-hover" v-if="showHoverVal === 4"> {{ taxPayerNameIdentifier }} NUMBER : {{ applicant_details.kra_pin }} </span>
              </template>

              <el-form :model="verification_details.kra_pin_verification" v-show="!kraReview">
                <el-form-item label="Validity">
                  <el-input v-model="verification_details.kra_pin_verification.validity" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Name">
                  <el-input v-model="verification_details.kra_pin_verification.name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="PIN/TIN Number">
                  <el-input v-model="verification_details.kra_pin_verification.pin_number" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Tax Obligations">
                  <el-input v-model="verification_details.kra_pin_verification.tax_obligations" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Date of Registration">
                  <el-date-picker v-model="verification_details.kra_pin_verification.registration_date" type="date" popper-class="date-popup" placeholder="Date of Registration"></el-date-picker>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" class="details-save-button" @click="updateReview('kra_pin_verification', `${taxPayerNameIdentifier} Verification`)">SAVE</el-button>
                </el-form-item>
              </el-form>

              <div class="el-col-lg-15 review-details" v-show="kraReview">
                <div class="el-row">
                  <div class="review-title">Validity</div>
                  <div class="review-desc">{{ this.verification_details.kra_pin_verification.validity }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Name</div>
                  <div class="review-desc">{{ this.verification_details.kra_pin_verification.name }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">{{ taxPayerNameIdentifier }} Number</div>
                  <div class="review-desc">{{ this.verification_details.kra_pin_verification.pin_number }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Tax Obligations</div>
                  <div class="review-desc">{{ this.verification_details.kra_pin_verification.tax_obligations }}</div>
                </div>
                <div class="el-row">
                  <div class="review-title">Date of Registration</div>
                  <div class="review-desc">{{ formatDate(this.verification_details.kra_pin_verification.registration_date) }}</div>
                </div>
              </div>
              <div class="el-col-lg-7 review-image">
                <div class="review-edit" @click="handleReviewEdit('kra_pin_verification')" v-show="kraReview">Edit</div>
              </div>
              <el-form class="applicant--incosistency-wrap" v-if="isPendingApplicant">
                <el-form-item> <el-checkbox v-model="verification_details.kra_pin_verification.inconsistency" name="kra_pin_inconsistsency" id="kra_pin_inconsistency"></el-checkbox>Mark for Data Inconsistency </el-form-item>
              </el-form>
              <div class="applicant--incosistency-mark" v-if="verification_details.kra_pin_verification.inconsistency && current_route === 'inconsistency'">
                Marked for Data Inconsistency
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </div>
  </div>
</template>
<script>
// detail_mixin
import DetailMxn from '../../mixins/detail_mixin';
import TimezoneMxn from '../../mixins/timezone_mixin';
import errorHandler from '../errorHandler.vue';
import GeneralMxn from '../../mixins/general_mixin';

export default {
  name: 'applicant-details',
  components: { errorHandler },
  mixins: [DetailMxn, TimezoneMxn, GeneralMxn],
  props: ['data', 'docs', 'category'],
  data() {
    return {
      vendor_types: VENDOR_TYPES,
      comments: '',
      popover_visible: false,
      reason: '',
      lock_ui: false,
      valid_docs: [],
      invalid_docs: [],
      current_verification: {},
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
      showHoverVal: 0,
      errorObj: '',
      loading: false,
      vendorTypeAge: 0,
    };
  },
  computed: {
    isPendingApplicant() {
      return this.current_route === 'applicant' || this.current_route === 'driver';
    },
    isDisabled() {
      return this.vendorTypeAge > 24;
    },
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
      return typeof this.verification_details !== 'undefined' ? this.verification_details.driving_license_check.review_status : [];
    },
    motorReview() {
      return this.verification_details.motor_vehicle_records_check.review_status;
    },
    insuranceReview() {
      return this.verification_details.car_insurance_validity.review_status;
    },
    goodConductReview() {
      return this.verification_details.good_conduct.review_status;
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

    taxPayerNameIdentifier() {
      if ('country' in this.applicant_details) {
        if (this.applicant_details.country === 'Kenya') {
          return 'KRA PIN';
        }
      }
      return 'TIN';
    },
    current_route() {
      return this.$route.name;
    },
    applicantStatus() {
      const applicantType = this.applicant_details.application_type;
      const routeDetails = this.routeDetails(this.category);
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.routeClass = routeDetails.text;
      return this.category === 'applications' || routeDetails.name === 'driver-applications' ? 'pending' : routeDetails.name;
    },
    recommendationOptions() {
            const options = [
              {
                value: 1,
                label: 'Recommended',
              },
              {
                value: 3,
                label: 'Not Recommended',
              },
            ];
            return options;
        },
  },
  watch: {},
  async beforeMount() {
    this.loading = true;
    this.current_verification = await this.$store.getters.current_verification;
    this.applicant_details = await this.current_verification.applicant_details;
    this.verification_details = await this.current_verification.verification_details;
    this.updateRecordNulls();
    this.getPartnerLogs();
    this.loading = false;
  },
  methods: {
    check_vendor_period() {
      const date = this.verification_details.motor_vehicle_records_check.manufacture_year;
      const manufactureDate = moment(date);
      const today = moment();

      const months = today.diff(manufactureDate, 'months');
      this.vendorTypeAge = this.applicant_details.vendor_type === '1' ? months : 0;
    },
    getApplicantStatus(name) {
      return this.applicantStatus === 'reviewed' ? this.recommendationStatus(this.applicant_details) : this.applicantStatus;
    },
    recommendationStatus(row) {
      const status = row.recommendation_status;
      return status === '1' ? 'recommended' : 'not recommended';
    },
    updateRecordNulls() {
      if (typeof this.verification_details !== 'undefined' && this.verification_details.driving_license_check === null) {
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
      if (typeof this.verification_details !== 'undefined' && this.verification_details.kra_pin_verification === null) {
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
      if (typeof this.verification_details !== 'undefined' && this.verification_details.car_insurance_validity === null) {
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
      if (typeof this.verification_details !== 'undefined' && this.verification_details.motor_vehicle_records_check === null) {
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
      if (typeof this.verification_details !== 'undefined' && this.verification_details.criminal_records_check === null) {
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
      if (typeof this.verification_details !== 'undefined' && this.verification_details.identity_check === null) {
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
        if (this.id_doc_change === true) {
          const upload_res = await this.uploadDocument('id_card');

          if (upload_res !== false) {
            review_json['id_card'] = upload_res;
            const obj = this.verification_details;
            obj['identity_check']['id_card'] = upload_res;
            this.verification_details = Object.assign({}, this.verification_details, obj);
          }
        }
      }

      const payload = {
        review_section: field,
        review_json: JSON.stringify(review_json),
        partner_id: this.applicant_details.partner_id,
        partner_id_no: this.applicant_details.id_no,
        admin_id: JSON.parse(localStorage.user).admin_id,
        admin_name: JSON.parse(localStorage.user).name,
      };

      axios
        .post(`${AUTH_URL}rider/admin_partner_api/v5/peleza/applications/update_review/`, JSON.stringify(payload), { headers: { Authorization: localStorage.token } })
        .then(response => {
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
      return axios
        .post(`${AUTH_URL}rider/admin_partner_api/v5/peleza/upload_doc/`, data, { headers: { 'content-type': 'multipart/form-data', Authorization: localStorage.token } })
        .then(response => response.data.file_name)
        .catch(err => {
          this.errorObj = err.response;
          return false;
        });
    },
    handleBack() {
      this.$router.push({ name: `${this.category}` });
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
    sendSMSNotification(type, phoneNo) {
      let message = '';

      if (this.applicant_review.status === '1') {
        message = `Hello ${this.capitalizeFirstLetter(this.applicant_details.applicant_username)}, Congratulations! Your application to join Sendy has was successful. We will contact you soon for training`;
      } else {
        message = `Hello ${this.capitalizeFirstLetter(this.applicant_details.applicant_username)}, Thank you for choosing to work with Sendy. Unfortunately, your application didn't meet all the verification requirements. Please try again after 3-6 months. `;
      }
      const payload = {
        send_sms: true,
        user_phone: phoneNo,
        message,
      };
      axios
        .post(`${AUTH_URL}customers/Sendy/sendysmsapi`, JSON.stringify(payload), { headers: { Authorization: localStorage.token } })
        .then(response => response)
        .catch(error => {
          this.errorObj = error.response;
          this.$notify.error({
            title: 'submit applicant review',
            message: 'failed to send applicant sms notification',
          });
        });
    },
    submitApplicantReview() {
      const payload = {
        partner_id: this.applicant_details.partner_id,
        applicant_review: this.applicant_review,
        admin_id: JSON.parse(localStorage.user).admin_id,
        admin_name: JSON.parse(localStorage.user).name,
      };
      axios
        .post(`${AUTH_URL}rider/admin_partner_api/v5/peleza/applications/submit_applicant_review/`, JSON.stringify(payload), { headers: { Authorization: localStorage.token } })
        .then(response => {
          if (response.data.status === true) {
            this.sendSMSNotification(this.applicant_details.application_type, this.applicant_details.partnerPhone);
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
          this.errorObj = error.response;
          this.$notify.error({
            title: 'submit applicant review',
            message: 'failed to update applicant review',
          });
          throw new Error('Could not update applicant');
        });
      this.getPartnerLogs();
    },
    submitDataInconsistency() {
      this.inconsistency_alert_status = false;
      this.inconsistency_alert_message = '';

      if (!this.validInconsistency) {
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
        .post(`${AUTH_URL}rider/admin_partner_api/v5/peleza/applications/submit_data_inconsitency/`, JSON.stringify(payload), { headers: { Authorization: localStorage.token } })
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
          this.errorObj = error.response;
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
    showDets(val) {
      this.showHoverVal = val;
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
