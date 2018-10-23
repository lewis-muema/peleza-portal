<template>
    <div class="doc" :class="{'wide': wide, 'narrow': narrow , 'blue' : blue}"
          v-loading="uploadLoading"
          element-loading-text="Uploading..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          >
          <div v-if="file_type != 'pdf'" class="doc__rotate">
            <button class="doc__rotate__button doc__rotate__button-left" @click="rotate(-90)">

                <svg width="16px" height="19px" viewBox="0 0 16 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="Random" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="ic_rotate_left_white_24px" transform="translate(-4.000000, -1.000000)">
                            <polygon id="Shape" points="0 0 24 0 24 24 0 24"></polygon>
                            <path d="M7.11,8.53 L5.7,7.11 C4.8,8.27 4.24,9.61 4.07,11 L6.09,11 C6.23,10.13 6.58,9.28 7.11,8.53 L7.11,8.53 Z M6.09,13 L4.07,13 C4.24,14.39 4.79,15.73 5.69,16.89 L7.1,15.47 C6.58,14.72 6.23,13.88 6.09,13 L6.09,13 Z M7.1,18.32 C8.26,19.22 9.61,19.76 11,19.93 L11,17.9 C10.13,17.75 9.29,17.41 8.54,16.87 L7.1,18.32 Z M13,4.07 L13,1 L8.45,5.55 L13,10 L13,6.09 C15.84,6.57 18,9.03 18,12 C18,14.97 15.84,17.43 13,17.91 L13,19.93 C16.95,19.44 20,16.08 20,12 C20,7.92 16.95,4.56 13,4.07 Z" id="Shape" fill="#FFFFFF" fill-rule="nonzero"></path>
                        </g>
                    </g>
                </svg>
            </button>
            <button class="doc__rotate__button doc__rotate__button-right" @click="rotate(90)">

                <svg width="16px" height="19px" viewBox="0 0 16 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="Random" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="ic_rotate_right_white_24px" transform="translate(-4.000000, -1.000000)">
                            <polygon id="Shape" points="0 0 24 0 24 24 0 24"></polygon>
                            <path d="M15.55,5.55 L11,1 L11,4.07 C7.06,4.56 4,7.92 4,12 C4,16.08 7.05,19.44 11,19.93 L11,17.91 C8.16,17.43 6,14.97 6,12 C6,9.03 8.16,6.57 11,6.09 L11,10 L15.55,5.55 Z M19.93,11 C19.76,9.61 19.21,8.27 18.31,7.11 L16.89,8.53 C17.43,9.28 17.77,10.13 17.91,11 L19.93,11 Z M13,17.9 L13,19.92 C14.39,19.75 15.74,19.21 16.9,18.31 L15.46,16.87 C14.71,17.41 13.87,17.76 13,17.9 Z M16.89,15.48 L18.31,16.89 C19.21,15.73 19.76,14.39 19.93,13 L17.91,13 C17.77,13.87 17.43,14.72 16.89,15.48 L16.89,15.48 Z" id="Shape" fill="#FFFFFF" fill-rule="nonzero"></path>
                        </g>
                    </g>
                </svg>
            </button>
        </div>
        <h3 class="doc__title">{{ title }}</h3>
        <button v-if="verification" class="doc__button doc__button__valid" :class="{ 'doc__button__valid--checked' : valid }" @click="yes">
            <svg width="18px" height="18px" viewBox="0 0 24 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <polygon class="tick" fill="#F7F7F7" points="8.68731188 17.2335085 8.82842712 17.3746238 23.3746238 2.82842712 20.5461966 5.68434189e-14 8.68731188 11.8588848 3.3336683 6.50524118 0.505241178 9.3336683 8.54619664 17.3746238"></polygon>
                </g>
            </svg>
        </button>
        <button v-if="verification" class="doc__button doc__button__invalid" :class="{ 'doc__button__invalid--checked' : !valid }" @click="no">
            <svg width="18px" height="18px" viewBox="0 0 15 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g class="tick" transform="translate(-8.000000, -8.000000)" fill="#F7F7F7">
                        <polygon id="Combined-Shape" points="17.3462754 15.0506989 22.1013979 10.2955764 19.8058215 8 15.0506989 12.7551225 10.2955764 8 8 10.2955764 12.7551225 15.0506989 8 19.8058215 10.2955764 22.1013979 15.0506989 17.3462754 19.8058215 22.1013979 22.1013979 19.8058215"></polygon>
                    </g>
                </g>
            </svg>
        </button>
        <object v-if="file_type == 'pdf'" :data="src" type="application/pdf" class="doc__pdf" width="100%" height="100%">
            <p>This browser does not support PDFs</p>
            <a :href="getImageUrl" target="_blank">Please download the file here</a>
        </object>
        <!-- <div v-if="file_type == 'pdf'" :id="`${this.title.split(' ').join('').toLowerCase()}-pdf-${context}`" class="doc__pdf"></div> -->
        <!-- <pdf v-if="file_type == 'pdf'" :src="src" class="doc__pdf"/> -->
        <!-- TODO: Zoom image on hover -->
        <div v-else-if="(/\.(gif|jpg|jpeg|tiff|png)$/i).test(getImageUrl)" :style="{backgroundImage: `url('${getImageUrl}')`}" class="doc__image" ref="image" @click="openLightBox"></div>
        <div v-else-if="extension !== 'gif'||extension !== 'jpg' || extension !== 'jpeg'||extension !== 'tiff'||extension !== 'png'||extension !== 'pdf'" class="doc__invalid">
            <h3>No Document </h3>
        </div>
        <div v-else class="doc__invalid">
            <h3>Invalid Document Format</h3>
            <a :href="getImageUrl" target="_blank">Download File</a>
        </div>
        <!-- <img :src="src" ref="buffer" hidden> -->
        <!-- <div class="doc__expiry" v-if="expiry">
                <label>Expiry date</label>
                <el-date-picker v-model="expiry_date" type="date" placeholder="Pick a day">
                </el-date-picker>
            </div> -->
        <div v-if="upload" class="doc__upload" >
          <a @click="initiateUpload()">Update Document</a>
        </div>

      <div style="display:none;" v-if="upload">
        <form name="upload_partner_docs" id="upload_partner_docs">
            <input type="file" name="id" id="id_card" @click="clearFile('id_card')" @change="uploadPhoto('id_card')"
                   accept="image/*" v-if="id == 'id_card'">

            <input type="file" name="id_card" id="id_card_2" @click="clearFile('id_card_2')" @change="uploadPhoto('id_card_2')"
                   accept="image/*" v-if="id == 'id_card_2'" ref="id_card_2">

            <input type="file" name="lb" id="lb" @click="clearFile('lb')" @change="uploadPhoto('lb')" accept="image/*" v-if="id =='lb'">
            <input type="file" name="vehicle" id="vehicle" @click="clearFile('vehicle')" @change="uploadPhoto('vehicle')"
                   accept="image/*" v-if="id=='vehicle'">
            <input type="file" name="gc" id="gc" @click="clearFile('gc')" @change="uploadPhoto('gc')" accept="image/*" v-if="id == 'gc'">
            <input type="file" name="dl" id="dl" @click="clearFile('dl')" @change="uploadPhoto('dl')" accept="image/*" v-if="id == 'dl'">
            <input type="file" name="insurance" id="insurance" @click="clearFile('insurance')"
                   @change="uploadPhoto('insurance')" accept="image/*" v-if="id == 'insurance'">
            <input type="file" name="photo" id="photo" @click="clearFile('driver')" @change="uploadPhoto('photo')"
                   accept="image/*" v-if="id == 'photo'">
            <input type="file" name="kra" id="kra" @click="clearFile('kra')" @change="uploadPhoto('kra')" accept="image/*" v-if="id == 'kra'">
        </form>
      </div>
    </div>
</template>

<script>
export default {
    name: 'doc',
    props: {
        src: String,
        expiry: null,
        title: {
            type: String,
            default: 'Doc'
        },
        wide: {
            type: Boolean,
            default: false
        },
        narrow: {
            type: Boolean,
            default: false
        },
        blue: {
            type: Boolean,
            default: false
        },
        verification: {
            type: Boolean,
            default: false
        },
        valid: {
            type: Boolean,
            default: false
        },
        context: {
            type: String,
            default: 'default'
        },
        id: {
            type: [Number, String],
            default: 'id'
        },
        rider_id: {
            type: [Number, String],
            default: 'id'
        },
        owner_id: {
            type: [Number, String],
            default: 'id'
        },
        vehicle_id: {
            type: [Number, String],
            default: 'id'
        },
        upload: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            current_rotation: 0,
            uploadLoading: false,
            extension: this.src.substring(this.src.lastIndexOf(".")+1),
        }
    },
    mounted() {
    },
    computed: {
        current_verification() {
            return this.$store.getters.current_verification;
        },
        file_type() {
            let a = this.src.split('.');
            return a[a.length - 1];
        },
        expiry_date: {
            get() {
                return this.expiry
            },
            set(v) {
                console.log(v)
            }
        },
        image_loaded() {
            return this.$refs.buffer ? this.$refs.buffer.complete : false;
        },
        getImageUrl() {
          return this.src;
        },

    },
    methods: {
        rotate(deg) {
            this.current_rotation += deg;
            this.$refs.image.style.transform = `rotate(${this.current_rotation}deg)`;
        },
        openLightBox() {
            this.$lightbox.open(this.src, this.current_rotation);
        },
        reset() {
            this.current_rotation = 0;
        },
        yes() {
            this.$emit('yes');
            console.log('yes emitted');
            this.emitValidityGlobally(true);
            //this.valid = true;
        },
        no() {
            this.$emit('no');
            //this.valid = false;
            console.log('no emitted');
            this.emitValidityGlobally(false);
        },
        emitValidityGlobally(status) {
          let context = this.context;
          let doc_validity = {"doc":context , "status": status}
          $eventBus.$emit('doc-validity', doc_validity);
        },

        verify(doc, status) {
            console.log('verify!', doc, status);
            let new_verification = Object.assign({}, this.current_verification);
            new_verification.docs[doc].valid = status;
            this.current_verification.docs[doc].valid = status;
            this.$store.commit('changeVerification', new_verification);
        },
        initiateUpload() {
           let photo_id = this.id;
           console.log(this.id);
           let el = document.getElementById(photo_id);
            if (el.onclick) {
               el.onclick();
            } else if (el.click) {
               el.click();
            }

        },
        clearFile(doc_id){
            document.getElementById(doc_id).value = '';
        },
        uploadPhoto(doc_id) {
          let data = new FormData();

          let files = document.getElementById(doc_id)['files'];

          if (!files.length) {
              return alert('Please choose a file to upload first.');
          }
          let file = files[0];
          data.append(doc_id, file);

          let fileType = files[0]['type'];
          let fileName = this.sanitizeFilename(file.name);
          let albumPhotosKey = encodeURIComponent(this.getAlbumName(doc_id)) + '/';
          let photoKey = albumPhotosKey + fileName;

          data.append("key", photoKey);
          data.append("field_name", doc_id);
          data.append("album", albumPhotosKey);


          let headers = {
            "headers": {
              "content-type": "multipart/form-data"
            }
          }

          axios.post(PARTNER_BASE_URL+'doc_upload', data,headers).then((response) => {
            console.log(response);
            this.uploadLoading = false;

            if(response.data.status == true) {
              let self = this;
              let fileName = response.data.file_name;
              console.log('Successfully uploaded photo.');
              self.generatePreview(doc_id,fileName);

              if(self.rider_id !== 'id' && typeof self.rider_id !== 'undefined'){
                  self.updateDoc(doc_id, fileName);
              } else if(self.vehicle_id !== 'id' && typeof  self.vehicle_id !== 'undefined'){
                      self.updateVehicleDoc(doc_id, fileName);
              } else if (self.owner_id !== 'id' && typeof self.owner_id !== 'undefined') {
                  self.updateOwnerDoc(doc_id, fileName);
              }

            } else {
              this.$notify.warning({
              title: 'There was an error uploading your photo: ',
              message: response.msg
              });
              return console.log('There was an error uploading your photo: ', err.message);

            }

          }).catch((err) => {
            console.error(err);
            this.uploadLoading = false;
            self.$notify.warning({
              title: 'There was an error uploading your photo: ',
              message: err.message
            });
            return console.log('There was an error uploading your photo: ', err.message);


          });



          this.uploadLoading = true;

        },
        addPhoto(doc_id){
            let files = document.getElementById(doc_id)['files'];
            if (!files.length) {
              return alert('Please choose a file to upload first.');
            }
            let file = files[0];
            let fileType = files[0]['type'];
            let fileName = this.sanitizeFilename(file.name);
                console.log(fileName);
            let albumPhotosKey = encodeURIComponent(this.getAlbumName(doc_id)) + '/';

            let photoKey = albumPhotosKey + fileName;
            let self = this;
            this.uploadLoading = true;
            s3.upload({
              Key: photoKey,
              Body: file,
              ACL: 'public-read',
              ContentType: fileType,
              }, function(err, data) {
                  if (err) {
                      self.uploadLoading = false;
                      self.$notify.warning({
                        title: 'There was an error uploading your photo: ',
                        message: err.message
                      });
                      return console.log('There was an error uploading your photo: ', err.message);

                  }
                  else{
                      console.log('Successfully uploaded photo.');
                      self.generatePreview(doc_id,fileName);

                      if(self.rider_id !== 'id' && typeof self.rider_id !== 'undefined'){
                          self.updateDoc(doc_id, fileName);
                      } else if(self.vehicle_id !== 'id' && typeof  self.vehicle_id !== 'undefined'){
                              self.updateVehicleDoc(doc_id, fileName);
                      } else if (self.owner_id !== 'id' && typeof self.owner_id !== 'undefined') {
                          self.updateOwnerDoc(doc_id, fileName);
                      }

                  }

            });
        },
        getAlbumName(iid){
            // if(iid == 'vehicle'){
            //     return 'photo';
            // }
            if(iid == 'insurance'){
                return 'insu';
            }
            // else if(iid == 'insurance'){
            //     return 'insu';
            // }
            else if(iid == 'id_card'){
                return 'id';
            }
            else if(iid == 'driver'){
                return 'photo';
            }
            else{
                return iid;
            }
        },
        sanitizeFilename(name){
             let temp_name = new Date().getTime()+name.toLowerCase().replace(/\s/g,'');
             return temp_name;
        },
        generatePreview(id, name){
            console.log(id)
            if(id == 'id_card'){
                this.id_card = name;
                this.id_card_src = "https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/"+this.getAlbumName(id)+"/"+name;
                this.src = this.id_card_src;
                this.valid = true;
            }

            else if(id == 'id_card_2'){
                this.id_card_2 = name;
                this.id_card_src_2 = "https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/"+this.getAlbumName(id)+"/"+name;
                this.src = this.id_card_src_2;
                this.valid = true;

            }
            else if(id == 'dl'){
                this.dl = name;
                this.dl_src = "https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/"+this.getAlbumName(id)+"/"+name;
                this.src = this.dl_src;
                this.valid = true;
            }
            else if(id == 'lb'){
                this.lb = name;
                this.lb_src = "https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/"+this.getAlbumName(id)+"/"+name;
                this.src = this.lb_src;
                this.valid = true;
            }
            else if(id == 'gc'){
                this.gc = name;
                this.gc_src = "https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/"+this.getAlbumName(id)+"/"+name;
                this.src = this.gc_src;
                this.valid = true;
            }
            else if(id == 'vehicle'){
                this.vehicle = name;
                this.vehicle_src = "https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/"+this.getAlbumName(id)+"/"+name;
                this.src = this.vehicle_src;
                this.valid = true;
            }
            else if(id == 'insurance'){
                this.insurance = name;
                this.insurance_src = "https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/"+this.getAlbumName(id)+"/"+name;
                this.src = this.insurance_src;
                this.valid = true;
            }
            else if(id == 'photo'){
                this.photo = name;
                this.photo_src = "https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/"+this.getAlbumName(id)+"/"+name;
                this.src = this.photo_src;
                this.valid = true;
            }
            else if(id == 'kra'){
                this.kra = name;
                this.kra_src = "https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/"+this.getAlbumName(id)+"/"+name;
                this.src = this.kra_src;
                this.valid = true;
            }
            else{
                console.log('preview unavailable', id);
            }
            this.$forceUpdate();
        },
        updateDoc(id,name){
          let payload = {
            "rider_id":this.rider_id,
          }
          let vehicle_payload = {
                'id':this.vehicle_id,
          }
          if(id == 'id_card'){
            payload['id_copy'] = name;
          } else if(id == 'id_card_2'){
            payload['id_copy_2'] = name;
          } else if(id == 'id_card_2'){
            payload['id_copy_2'] = name;
          } else if(id == 'photo'){
            payload['photo'] = name;
          } else if(id == 'kra'){
            payload['kra_copy'] = name;
          } else if(id == 'gc'){
            payload['gc_copy'] = name;
          } else if(id == 'dl'){
            payload['dl_copy'] = name;

            // vehicle documents

          } else if(id == 'lb'){
            vehicle_payload['log_book'] = name;
          } else if(id == 'insurance'){
            vehicle_payload['insurance'] = name;
          } else if(id == 'vehicle'){
            vehicle_payload['photo'] = name;
          }

          console.log(payload)
          if(id == 'lb' || id == 'insurance' || id == 'vehicle') {
             axios.post(PARTNER_BASE_URL + 'partner_management/update_vehicle/', vehicle_payload)
              .then((response) => {
                console.log(response)
                if (response.data.status) {
                  this.$notify.success({
                    title: 'Update Vehicle',
                    message: response.data.msg
                  });
                  this.generatePreview(id,name);
                  this.uploadLoading = false;
                } else {
                  this.$notify.warning({
                    title: 'Update Vehicle',
                    message: response.data.msg
                  });
                  this.uploadLoading = false;

                }

              })
              .catch((error) => {
                this.uploadLoading = false;
                log(error);
                this.$notify.warning({
                  title: 'Error',
                  message: 'Could not update vehicle'
                });
                return;
                throw new Error('Could not update vehicle');
              });
          } else {
            axios.post(PARTNER_BASE_URL + 'partner_management/update_rider/', payload)
              .then((response) => {
                console.log(response)
                if (response.data.status) {
                  this.$notify.success({
                    title: 'Update Partner',
                    message: response.data.msg
                  });
                  this.uploadLoading = false;
                  this.generatePreview(id,name);
                } else {
                  this.$notify.warning({
                    title: 'Update Partner',
                    message: response.data.msg
                  });
                  this.uploadLoading = false;

                }

              })
              .catch((error) => {
                this.uploadLoading = false;
                log(error);
                this.$notify.warning({
                  title: 'Error',
                  message: 'Could not update partner'
                });
                return;
                throw new Error('Could not update partner');
              });
          }
        },

        updateOwnerDoc(id,name){
          let payload = {
            "id":this.owner_id,
          }
          if(id == 'id_card'){
            payload['id_card'] = name;
          } else if(id == 'id_card_2'){
            payload['id_copy_2'] = name;
          } else if(id == 'id_card_2'){
            payload['id_copy_2'] = name;
          } else if(id == 'photo'){
            payload['photo'] = name;
          } else if(id == 'kra'){
            payload['kra_pin_cert'] = name;
          } else if(id == 'gc'){
            payload['gc_copy'] = name;
          } else if(id == 'dl'){
            payload['dl_copy'] = name;
          }

            axios.post(PARTNER_BASE_URL + 'partner_management/update_owner/', payload)
              .then((response) => {
                console.log(response)
                if (response.data.status) {
                  this.$notify.success({
                    title: 'Update Owner',
                    message: response.data.msg
                  });
                  this.uploadLoading = false;
                  this.generatePreview(id,name);
                } else {
                  this.$notify.warning({
                    title: 'Update Owner',
                    message: response.data.msg
                  });
                  this.uploadLoading = false;

                }

              })
              .catch((error) => {
                this.uploadLoading = false;
                log(error);
                this.$notify.warning({
                  title: 'Error',
                  message: 'Could not update owner'
                });
                return;
                throw new Error('Could not update owner');
              });
        },
        updateVehicleDoc(id,name) {
          let vehicle_payload = {
                'id':this.vehicle_id,
          }
          if (id == 'lb') {
            vehicle_payload['log_book'] = name;
          } else if (id == 'insurance') {
            vehicle_payload['insurance'] = name;
          } else if (id == 'vehicle') {
            vehicle_payload['photo'] = name;
          }
          if (id == 'lb' || id == 'insurance' || id == 'vehicle') {
            axios.post(PARTNER_BASE_URL + 'partner_management/update_vehicle/', vehicle_payload)
              .then((response) => {
                console.log(response)
                if (response.data.status) {
                  this.$notify.success({
                    title: 'Update Vehicle',
                    message: response.data.msg
                  });
                  this.uploadLoading = false;
                  this.generatePreview(id,name);
                } else {
                  this.$notify.warning({
                    title: 'Update Vehicle',
                    message: response.data.msg
                  });
                  this.uploadLoading = false;

                }

              })
              .catch((error) => {
                this.uploadLoading = false;
                log(error);
                this.$notify.warning({
                  title: 'Error',
                  message: 'Could not update vehicle'
                });
                return;
                throw new Error('Could not update vehicle');
              });
          }
        }
    },
}
</script>



<style lang="scss">
.doc {
    display: inline-block;
    position: relative;
    width: 30vw;
    height: 40vh;
    overflow: hidden;
    padding-bottom: 60px;
    margin-bottom: 80px;
    background: rgba(0, 0, 0, 0.1);
    &.wide {
        width: 60vw;
    }
    &.narrow {
        width: 20vw;
    }
    &.blue {
        background: rgba(0,99,163,0.9);
    }
    &__rotate {
        position: absolute;
        top: 4px;
        left: 2px;
        &__button {
            background: none;
            border: none;
            outline: none;
            cursor: pointer;
            &-left {}
            &-right {}
        }
    }
    &__title {
        text-align: center;
        text-transform: uppercase;
        margin-top: 5px;
        margin-left: 5px;
    }
    &__button {
        position: absolute;
        top: 5px;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        border: none;
        outline: none;
        background: #d4d4d4;
        padding: 0;
        cursor: pointer;
        &:hover {
            transform: scale(1.04);
        }
        svg {
            height: 100%;
            .tick {
                fill: #f7f7f7;
            }
        }
        &__valid {
            right: 45px;
            &--checked {
                background: #1E7FC3;
                box-shadow: 0 0 4px 0 rgba(darken(#1E7FC3, 10%), 0.8);
                transform: scale(1.05);
            }
        }
        &__invalid {
            right: 10px;
            &--checked {
                background: #f57e20;
                box-shadow: 0 0 4px 0 rgba(darken(#f57e20, 10%), 0.8);
                transform: scale(1.05);
            }
        }
    }
    &__image {
        height: 85%;
        width: 100%;
        background-size: contain;
        background-position: center;
        border-radius: 5px;
        background-repeat: no-repeat;
        transition: all 0.05s ease-in-out;
        cursor: zoom-in;
    }
    &__pdf {
        height: 100%;
    }
    &__expiry {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        text-align: center;
        padding: 10px 0;
        input {
            background: transparent;
            color: white;
        }
    }
    &__invalid {
        height: 85%;
        width: 100%;
        background: #333333;
        color: #d4d4d4;
        position: relative;
        h3 {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-5deg);
            font-size: 2em;
            margin: 0;
            text-transform: uppercase;
            opacity: 0.6;
            width: 100%;
            text-align: center;
        }
        a {
            position: absolute;
            bottom: 10%;
            left: 50%;
            transform: translateX(-50%);
            color: #1E7FC3;
            text-transform: uppercase;
            font-size: 1.3em;
            font-weight: bold;
            &:visited {
                color: #1E7FC3;
            }
        }
    }
    &__upload {
       text-align: center;
       position: absolute;
       width: inherit;
       padding-top: 15px;
       a {
         color: #fff;
         padding: 5px;
         border: 1px solid #f97d38;
         background-color: #f97d38;
         cursor: pointer;
       }
       a:hover , a:focus {
         color: #f97d38;
         border: 1px solid #f97d38;
         background-color: #fff;

       }
    }
}
</style>
