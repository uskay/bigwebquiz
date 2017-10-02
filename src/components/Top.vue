/**
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

<template>
    <div class="top">
        <div class="iconWrapper">
            <img src="../assets/icon@192.png" />
        </div>
        <div class="subtitle">
            "MSCs.. DO YOU KNOW THE WEB?"
        </div>
        <div class="loginButtonWrapper">
            <img v-on:click="auth" src="../assets/btn_google_signin_light_normal_web.png" />
        </div>
    </div>
</template>

<script>
export default {
  name: 'top',
  data () {
    return {
      msg: 'Welcome to Your Vue.js PWA'
    }
  },
  beforeCreate: function() {
      console.log("aaa:" + this.$router);
      var quizNo = firebase.database().ref('quizNo');
      quizNo.on('value', function(snapshot) {
          let currentQuizNo = snapshot.val();
          localStorage.setItem("currentQuizNo", currentQuizNo);
          if(currentQuizNo && localStorage.getItem("user.userid")) {
              this.$router.push("/quiz/" + currentQuizNo);
          }
      }.bind(this));
  },
  methods: {
    resizeIframe: function(obj){
        obj.currentTarget.style.height = obj.currentTarget.contentWindow.document.body.scrollHeight + 'px';
    },
    auth: function(){
        console.log(this);
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log(user);
            console.log(user.displayName);
            console.log(user.photoURL);
            localStorage.setItem("user.displayName", user.displayName);
            localStorage.setItem("user.photoURL", user.photoURL);
            localStorage.setItem("user.userid", user.email);
            // . (period)
            // $ (dollar sign)
            // [ (left square bracket)
            // ] (right square bracket)
            // # (hash or pound sign)
            // / (forward slash)
            try{
                firebase.database().ref('users/' + 
                user.email.replace(".","dot")
                            .replace("$","dollar")
                            .replace("[","bracket")
                            .replace("]","bracket")
                            .replace("#","hash")
                            .replace("/","slash")
                            ).set({
                    username: user.displayName,
                    email: user.email,
                    photoURL : user.photoURL
                });
            }catch(e){
                console.log(e);
            }
            

            console.log(this.$el);
            this.$emit("myEvent", "xyz");

            this.$router.push("/quiz/" + localStorage.getItem("currentQuizNo"));
        // ...
        }.bind(this)).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.iconWrapper {
    margin: 0 auto;
    margin-top:120px;
    width:200px;
    height:200px;
    border-radius: 50%;
    background-color:#FFF;
    text-align: center;
}
.iconWrapper img {
    margin-top:4px;
}
.subtitle {
    color: #FFF;
    margin:0 auto;
    width:100%;
    text-align: center;
    margin-top:40px;
}
.loginButtonWrapper {
    width:100%;
    text-align: center;
    margin-top:40px;
}
</style>
