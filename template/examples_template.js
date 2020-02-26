exports.examples_HTML = (body) => {
    return `
        <!doctype html>
        <html>
        <head>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"> 
            <title>MIND MAP</title>
            <meta charset="utf-8">
        </head>
        <body>
        <h1>Mind Map</h1>
            ${body}
        </body>
        <style>
        ${this.contents_style()}
        </style>
        </html>`;
}
exports.create_examples_body = (word) => {
    return `<table id="create_table">
    <tbody>
    <form autocomplete="off" action="/examples/create-process" method="post">
    <tr>
        <td>단어 이름</td>
        <td><input type="text" name="s_name" id="c_name" value="${word[0].w_name}" disabled></td>

    </tr>
    <tr>
        <td>예시 이름</td>
        <td><input type="text" name="e_name" id="e_name" placeholder="예시 이름"></td>
    </tr>
        <tr>
        <td>예시 내용</td>
    <td><input type="text" name="e_content" id="e_content" placeholder="예시 내용"></td>
    </tr>
    <tr>
        <input type="hidden" name="s_no" id="s_no" value=${word[0].s_no}>
        <input type="hidden" name="w_no" id="w_no" value=${word[0].w_no}>
        <td><button type="submit" id="create_button"><i class="fas fa-plus"></i>생성</button></td></form>
       <td><a href="/subjects/${word[0].s_no}"><button class="back_button"><i class="fas fa-arrow-left"></i>뒤로가기</button></a></td>
    </tr>
    </tbody></table>`;
}
exports.update_examples_body = (exmaple, s_no) => {
    return `<table id="create_table">
    <tbody>
    <form autocomplete="off" action="/examples/update-process" method="post">
    <tr>
        <td>과목 이름</td>
        <td><input type="text" name="w_name" id="w_name" value="${exmaple[0].w_name}" disabled></td>

    </tr>
    <tr>
        <td>예시 이름</td>
        <td><input type="text" name="e_name" id="e_name" value="${exmaple[0].e_name}"></td>
    </tr>
        <tr>
        <td>예시 내용</td>
    <td><input type="text" name="e_content" id="e_content" value="${exmaple[0].e_content}"></td>
    </tr>
    <tr>
        <input type="hidden" name="s_no" id="s_no" value=${s_no}>
        <input type="hidden" name="e_no" id="e_no" value=${exmaple[0].e_no}>
        <td><button type="submit" id="create_button"><i class="fas fa-plus"></i>수정</button></td></form>
       <td><a href="/subjects/${s_no}"><button class="back_button"><i class="fas fa-arrow-left"></i>뒤로가기</button></a></td>
    </tr>
    </tbody></table>`;
}
exports.contents_style = () => {
    return `
    body{
        color: #4B89DC;
        text-align: center;
        width: 1900px;
    }
    h1{
        font-size: 80px;
    }
    table{
        margin: auto;
        font-size: 50px;
        border : 1px solid #4B89DC;
    }
    button{
        color: #4B89DC;
        width: 100%;
        height: 100%;
        font-size: 50px;
        background-color: white;
        border: none;
    }
    button:hover{
        color: white;
        background-color: #4B89DC;
        box-shadow: 0px 15px 20px #4B89DC;
        transform: translateY(-10px);
    }
    td {
        border: 1px solid #4B89DC;
    }
    input{
        color: #4B89DC;
        width: 100%;
        height: 100%;
        font-size: 50px;
        background-color: white;
        border: none;
        text-align: left;
    }
    `;
}