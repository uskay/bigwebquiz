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
    <div class="rank">

    </div>
</template>

<script>
export default {
    name: 'rank',
    mounted: function(obj){
        firebase.database().ref('quiz').once('value').then(function(snapshot) {
            let options = snapshot.val();
            Object.keys(options).map(key => {
                localStorage.setItem("question" + key, options[key].correctAnswer)
            });
        }.bind(this));
        var userScoreTable = [];
        firebase.database().ref('users').once('value').then(function(snapshot) {
            
            let allusers = snapshot.val();
            Object.keys(allusers).map(id => {
                var point = 0;
                if(!allusers[id].answers) {
                    return;
                }
                Object.keys(allusers[id].answers).map(key => {
                    if(localStorage.getItem(key) == allusers[id].answers[key].answer){
                        point++;
                    }
                })
                let userScoreMap = {
                    "id": id,
                    "name": allusers[id].username,
                    "point": point
                }
                userScoreTable.push(userScoreMap);
            })
            console.table(userScoreTable);
        }.bind(this));
    },
    methods: {
        escapeHTML: function(string) {
            if(typeof string !== 'string') {
                return string;
            }
            return string.replace(/[&'`"<>]/g, function(match) {
                return {
                '&': '&amp;',
                "'": '&#x27;',
                '`': '&#x60;',
                '"': '&quot;',
                '<': '&lt;',
                '>': '&gt;',
                }[match]
            });
        },
        showText: function(obj) {
            Array.prototype.slice.call(this.$el.getElementsByClassName("answerText")).map(obj => obj.style.display = "block")
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.odds {
    width:1200px;
    margin: 0 auto;
    margin-top:150px;
    height:500px;
}
.answer {
    float: left;
    width:300px;
    display: none;
}
.answer .bar {
    height:500px;
    width:100px;
    position: relative;
    margin: 0 auto;    
}
.answer .bar .bet {
    width:100%;
    position: absolute;
    bottom: 0px;
}
.answer .bar .bet1 {
    background-color: #FFCB2B;
}
.answer .bar .bet2 {
    background-color: #41B883;
}
.answer .bar .bet3 {
    background-color: #61DAFB;
}
.answer .bar .bet4 {
    background-color: #F8688A;
}
.answer .answerText {
    width: 100%;
    margin-top: 10px;
    text-align: center;
    font-size: 1.5em;
    color: #FFF;
    display: none;
}
.answer .percent {
    width: 100%;
    margin-top: 20px;
    text-align: center;
    font-size: 3.0em;
    color: #FFF;
    font-weight: bold;
}
.showText {
    width: 100px;
    height: 50px;
    border-radius: 5px;
    border: none;
    font-size: 1.2em;
    background-color: #555;
    color: #FFF;
    margin-top: 50px;
    cursor:pointer;
    float:right;
}
</style>
