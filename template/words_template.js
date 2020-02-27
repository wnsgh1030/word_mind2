exports.words_HTML = (body) => {
    return `
        <!doctype html>
        <html>
        <head>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"> 
            <title>MIND MAP</title>
            <meta charset="utf-8">
            <script language="javascript">
            <!--
                function add_item(){
                    const div = document.createElement('div');
                    div.innerHTML = document.getElementById('pre_set').innerHTML;
                    document.getElementById('relationfield').appendChild(div);
                }
             
                function remove_item(obj){
                    // obj.parentNode 를 이용하여 삭제
                    document.getElementById('relationfield').removeChild(obj.parentNode);
                }
            //-->
            </script>
        </head>
        <body>
        <h1>Mind Map <a href="/"><button class="home"><i class="fas fa-home"></i>home</button></a></h1>
            ${body}
        </body>
        <style>
        ${this.words_style()}
        </style>
        </html>`;
}
exports.create_words_body = (result, words) => {
    let body = `
    <form autocomplete="off" action="/words/create-process" method="post"><table id="create_table">
    <tbody>
    <tr>
        <td>과목 이름</td>
        <td><input type="text" name="c_name" id="c_name" value="${result[0].s_name}" disabled></td>
    </tr>
    <tr>
        <td>단어 이름</td>
        <td><input type="text" name="w_name" id="w_name" placeholder="단어 이름"></td>
    </tr>
    <tr>
        <td>정의</td>
        <td><input type="text" name="w_definition" id="w_definition" placeholder="단어 정의"></td>
    </tr>
    <tr>
        <td>특징</td>
        <td><input type="text" name="w_character" id="w_character" placeholder="단어 특징"></td>
    </tr>
    <tr><td>단어 관계</td><td><button class="word_button" type="button" onclick="add_item()"><i class="fas fa-plus-circle"></i>추가</button></td>
    <tr><td colspan="3"><div id="relationfield"></div></td></tr>
    <div id="pre_set" style="display:none"><select name="w2_no">`;
    let i = 0;
    while (i < words.length && words != undefined) {
        body = body + `<option value="${words[i].w_no}">${words[i].w_name}</option>`;
        i = i + 1;
    }
    body = body +
        `</select>
    <input type="text" name="description" placeholder="관계 설명"><button class="word_button" type="button" id="remove" onclick="remove_item(this)"><i class="fas fa-minus-circle"></i>삭제</button></div>
    <tr>
        <input type="hidden" name="s_no" id="s_no" value=${result[0].s_no}>
        <td><button class="word_button" type="submit" id="create_button"><i class="fas fa-plus"></i>생성</button></td></form>
       <td><a href="/subjects/${result[0].s_no}"><button class="word_button" type="button" class="back_button"><i class="fas fa-arrow-left"></i>뒤로가기</button></a></td>
    </tr>
    </tbody></table>`;
    return body;
}
exports.update_words_body = (s_name, word, words, relation) => {

    let i = 0;
    let select = '';
    while (i < words.length) {
        select = select + `<option value="${words[i].w_no}">${words[i].w_name}</option>`
        i = i + 1;
    }
    select = select + `</select>`;
    let body = `
    <form autocomplete="off" action="/words/update-process" method="post"><table id="update_table">
    <tbody>
    <tr>
        <td>과목 이름</td>
        <td><input type="text" name="c_name" id="c_name" value="${s_name[0].s_name}" disabled></td>
    </tr>
    <tr>
        <td>단어 이름</td>
        <td><input type="text" name="w_name" id="w_name" value="${word[0].w_name}"></td>
    </tr>
    <tr>
        <td>정의</td>
        <td><input type="text" name="w_definition" id="w_definition" value="${word[0].w_definition}"></td>
    </tr>
    <tr>
        <td>특징</td>
        <td><input type="text" name="w_character" id="w_character" value="${word[0].w_character}"></td>
    </tr>
    <tr><td>단어 관계</td><td><button class="word_button" type="button" onclick="add_item()"><i class="fas fa-plus-circle"></i>추가</button></td>
    <tr><td colspan="3"><div id="relationfield">`

    let j = 0;
    while(j < relation.length){
        let relationship = '<div><select name="w2_no">';
        let i = 0;
        while(i < words.length){
            if(relation[j].w2_no == words[i].w_no){
                relationship = relationship +`<option value="${words[i].w_no}" selected="selected">${words[i].w_name}</option>`;
                
            }
            else{
                relationship = relationship +`<option value="${words[i].w_no}">${words[i].w_name}</option>`;
            }
            i = i + 1;
        }
        relationship = relationship + `<input type="text" name="description" value="${relation[j].description}" ><button class="word_button" type="button" id="remove" onclick="remove_item(this)"><i class="fas fa-minus-circle"></i>삭제</button></div>`;
        j = j + 1;
        body = body + relationship;
    }
       
    body = body + `</div></td></tr><div id="pre_set" style="display:none"><select name="w2_no">` + select + `
    <input type="text" name="description" placeholder="관계 설명"><button class="word_button" type="button" id="remove" onclick="remove_item(this)"><i class="fas fa-minus-circle"></i>삭제</button></div>
    <tr>
        <input type="hidden" name="w_no" id="w_no" value=${word[0].w_no}>
        <input type="hidden" name="s_no" id="s_no" value=${word[0].s_no}>
        <td><button class="word_button" type="submit" id="update_button"><i class="fas fa-plus"></i>수정</button></td></form>
       <td><a href="/subjects/${word[0].s_no}"><button class="word_button" type="button" class="back_button"><i class="fas fa-arrow-left"></i>뒤로가기</button></a></td>
    </tr>
    </tbody></table>`;
    return body;
}

exports.words_body = (words, relation, examples) => {
    let body = `<table class="create_table"><thead>
    <tr><td>단어 이름</td><td>정의</td><td>특징</td></tr></thead>
    <tbody><tr><td>${words[0].w_name}</td><td>${words[0].w_definition}</td><td>${words[0].w_character}</td></tr></tbody></table>`;
    let i = 0;
    let relationship = `<table class="create_table"><thead><tr><td>연관 단어</td><td>연관 내용</td></tr></thead>`;
    while (i < relation.length){
        relationship = relationship + `<tbody><tr><td>${relation[i].w_name}</td><td>${relation[i].description}</td></tr>`;
        i = i + 1;
        if(i == relation.length){
            relationship = relationship + `</tbody></table>`;
            body = body + relationship;
        }
    }
    i = 0;
    let example = `<table class="create_table"><thead><tr><td>예시 단어</td><td>예시 내용</td></tr></thead>`;
    while(i < examples.length){
        example = example + ` <tbody><tr><td>${examples[i].e_name}</td><td>${examples[i].e_content}</td></tr>`;
        i = i + 1;
        if(i == examples.length){
            example = example + `</tbody></table>`;
            body = body + example;
        }
    }
    return body;
}
exports.words_style = () => {
    return `
    body{
        color: #4B89DC;
        text-align: center;
        width: 1900px;
    }
    h1{
        font-size: 80px;
    }
    .home{
        color: #4B89DC;
        background-color: white;
        border: none;
    }
    table{
        margin: auto;
        font-size: 40px;
        border : 1px solid #4B89DC;
        border-collapse: collapse;
        margin-bottom: 50px;
    }
    .word_button{
        color: #4B89DC;
        width: 100%;
        height: 100%;
        font-size: 40px;
        background-color: white;
        border: none;
    }
    .word_button:hover{
        color: white;
        background-color: #4B89DC;
        box-shadow: 0px 15px 20px #4B89DC;
        transform: translateY(-10px);
    }
    td {
        border: 1px solid #4B89DC;
    }
    thead td{
        font-weight: bold;
        width: 200px;
        background-color: #4B89DC;
        border : 1px solid white;
        color: white;
    }
    select{
        color: #4B89DC;
        width: 100%;
        height: 100%;
        font-size: 40px;
        background-color: white;
        border: 1px solid;
    }
    input{
        color: #4B89DC;
        width: 100%;
        height: 100%;
        font-size: 40px;
        background-color: white;
        border: none;
        text-align: left;
    }
    div#relationfield{
        text-align:center;
    }
    button#remove{
        border: 1px solid #4B89DC;
    }
    button#remove:hover{
        color: white;
        background-color: #4B89DC;
        box-shadow: 0px 15px 20px #4B89DC;
        transform: translateY(-10px);
    }`;
}