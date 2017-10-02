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
  <div id="app">
    <div class="background"></div>
    <header>
        <div class="logo">
            <img src="./assets/logo_q.png"/>
        </div>
        <div class="title">
            THE BIG WEB QUIZ
        </div>
        <div id="userPhotoWrapper" class="user">
            <img id="userPhoto" src=""/>
        </div>
    </header>
    <router-view v-on:myEvent="parentHandler"></router-view>
    <footer></footer>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted: function() {
        let displayName = localStorage.getItem("user.displayName");
        let photoURL = localStorage.getItem("user.photoURL");
        let userid = localStorage.getItem("user.userid");
        if(!photoURL){
            return;
        }
        this.$el.querySelector("#userPhoto").src = photoURL;
        this.$el.querySelector("#userPhotoWrapper").style.display = "block";
  },
  methods: {
      parentHandler: function(a){
        let displayName = localStorage.getItem("user.displayName");
        let photoURL = localStorage.getItem("user.photoURL");
        let userid = localStorage.getItem("user.userid");
        this.$el.querySelector("#userPhoto").src = photoURL;
        this.$el.querySelector("#userPhotoWrapper").style.display = "block";
      }
  }
}
</script>

<style>
html, body {
    font-family:"Roboto", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI","Noto Sans Japanese","ヒラギノ角ゴ ProN W3", Meiryo, sans-serif;
    width:100%;
    height:100%; 
    padding: 0xp;
    margin: 0px;
}
.background {
    background-image: linear-gradient(-200deg, #220065 0%, #2b546d 100%);
    width:100%;
    height:100%;
    z-index:-1;
    position:fixed;
    top:0px;
    left:0px;
}

header {
    width:100%;
    height:60px;
    position: fixed;
    top:0px;
    left:0px;
    z-index:1000;
    background-color: #220065;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}
header .logo img {
    height:40px;
    position:relative;
    margin-left: 10px;
    margin-top: 10px;
    float:left;
}
header .title {
    float:left;
    font-size: 1.2em;
    color: #FFF;
    line-height: 3.2;
    margin-left:5px;
}
header .user {
    width: 35px;
    height:35px;
    float:right;
    margin-top:15px;
    margin-right:15px;
    text-align: center;
    display:none;
}

header .user img {
    border-radius: 50%;
    height: 100%;
    width:100%;
}

footer {
    height: 50px;
    width:100%;
    background-color: transparent;
    position:relative;
}
</style>