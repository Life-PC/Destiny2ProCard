function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function AccountChangeText(inputNum) {
    switch (inputNum) {
        case 0:
            console.log(inputNum);
            if (document.getElementsByName('v0')[0].checked === false)
                document.getElementsByName('v0')[0].checked = true;
            break;
        case 1:
            if (document.getElementsByName('v1')[0].checked === false)
                document.getElementsByName('v1')[0].checked = true;
            break;
    }
}

function AccoutCheckChenge(inputNum) {
    switch (inputNum) {
        case 0:
            if (document.getElementsByName('v0')[0].checked === false)
                document.getElementsByName('ps')[0].value = '';
            break;
        case 1:
            if (document.getElementsByName('v1')[0].checked === false)
            {
                document.getElementsByName('dc')[0].value = '';
                document.getElementsByName('dcn')[0].value = '';
            }
            break;
    }
}

function PhraseChangeCount() {
    document.getElementById('phrase').innerText = '一言（後' + (200 - document.getElementsByName('m')[0].value.length) + '字）';
}

window.onload = function () {
    let name = getParam('n');
    if (name === '' || name === null)
    {
        document.getElementById('phrase').innerText = '一言（後200字）';
        return;
    }

    name = decodeURIComponent(getParam('n'));
    let id = decodeURIComponent(getParam('id'));
    let idn = getParam('idn');
    let platform = [getParam('p0'), getParam('p1'), getParam('p2')];
    let voice = [getParam('v0'), getParam('v1'), getParam('v2')];
    let guardian = [getParam('g0'), getParam('g1'), getParam('g2')];
    let message = decodeURIComponent(getParam('m'));

    document.getElementById('name').innerHTML = name;
    document.getElementById('bungieID').innerHTML = id + '&#035;' + idn;

    let platformListText = '';
    let voiceListText = '';
    let guardianListText = '';

    for (let i = 0; i < 3; i++) {
        if (platform[i] === 'on') {
            let listText = i === 0 ? 'PS' : i === 1 ? 'PC' : 'XBOX';
            platformListText += '<li>' + listText + '</li>';
        }
        if (voice[i] === 'on') {
            let listText = i === 0 ? 'PS：' + getParam('ps') : i === 1 ? 'Discord：' + decodeURIComponent(getParam('dc')) + '&#035;' + getParam('dcn') : '聞き専';
            voiceListText += '<li>' + listText + '</li>';
        }
        if (guardian[i] === 'on') {
            let listText = i === 0 ? 'ハンター' : i === 1 ? 'ウォーロック' : 'タイタン';
            guardianListText += '<li>' + listText + '</li>';
        }
    }
    document.getElementById('platform').innerHTML = platformListText;
    document.getElementById('voice').innerHTML = voiceListText;
    document.getElementById('guardian').innerHTML = guardianListText;
    document.getElementById('message').innerHTML = message;

    const apiKey = '86efd9a9507da8f941e167876b25ccea';
    const longUrl = window.location;
    const apiUrl = 'https://xgd.io/V1/shorten';
    const apiCallUrl = `${apiUrl}?url=${encodeURIComponent(longUrl)}&key=${apiKey}`;
    let shortUrlText = '';

    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiCallUrl, false);
    xhr.send();

    if (xhr.readyState == 4 && xhr.status == 200) {
        if (typeof xhr.response === "string") {
            const data = JSON.parse(xhr.response);
            shortUrlText = data.shorturl;
        }
    } else {
        shortUrlText = longUrl;
    }

    document.getElementById('send').innerHTML =
        '<ul class="share">' +
        '<li>' +
        '<div class="line-it-button" data-lang="ja" data-type="share-a" data-env="REAL" data-url="' + shortUrlText + '" data-color="default" data-size="large" data-count="false" data-ver="3" style="display: none;"></div>' +
        '</li>' +
        '<li>' +
        '<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false" data-url="' + shortUrlText + '">Tweet</a>' +
        '</li>' +
        '</ul>';
};

let missCount = 0;
let errorMessage = '以下の項目を記入してください。\n\n';
function inputMissCount() {
    let name = document.getElementsByName('n')[0].value;
    let id = document.getElementsByName('id')[0].value;
    let idn = document.getElementsByName('idn')[0].value;
    let platformCount = 0;
    let voiceCount = 0;
    let guardianCount = 0;

    if (name === '') {
        missCount = missCount + 1;
    }
    if (id === '' || idn === '') {
        missCount = missCount + 2;
    }

    if (missCount >= 1) {
        switch (missCount) {
            case 1:
                errorMessage = errorMessage + '名前を入力してください。\n';
                break;
            case 2:
                errorMessage = errorMessage + 'BungieIDを入力してください。\n';
                break;
            case 3:
                errorMessage = errorMessage + '名前とBungieIDを入力してください。\n';
                break;
        }
    }

    platformCount = platformCount + (document.getElementsByName('p0')[0].checked ? 1 : 0);
    platformCount = platformCount + (document.getElementsByName('p1')[0].checked ? 1 : 0);
    platformCount = platformCount + (document.getElementsByName('p2')[0].checked ? 1 : 0);
    if (platformCount === 0) {
        errorMessage = errorMessage + 'プラットフォームのいずれかを選択してください。\n';
        missCount = missCount + 1;
    }

    voiceCount = voiceCount + (document.getElementsByName('v0')[0].checked ? 1 : 0);
    voiceCount = voiceCount + (document.getElementsByName('v1')[0].checked ? 1 : 0);
    voiceCount = voiceCount + (document.getElementsByName('v2')[0].checked ? 1 : 0);
    if (voiceCount === 0) {
        errorMessage = errorMessage + 'ボイスチャットのいずれかを選択し、アカウントを入力してください。\n';
        missCount = missCount + 1;
    }
    else if (document.getElementsByName('v0')[0].checked && document.getElementsByName('ps')[0].value === '') {
        errorMessage = errorMessage + 'ボイスチャットPSアカウントが記載されていません。\n';
        missCount = missCount + 1;
    }
    else if (document.getElementsByName('v0')[0].checked === false && document.getElementsByName('ps')[0].value !== '') {
        errorMessage = errorMessage + 'ボイスチャットPSアカウントのチェックが入っていません。\n';
        missCount = missCount + 1;
    }

    if (document.getElementsByName('v1')[0].checked && document.getElementsByName('dc')[0].value === '' && document.getElementsByName('dcn')[0].value === '') {
        errorMessage = errorMessage + 'ボイスチャットDiscordアカウントが記載されていません。\n';
        missCount = missCount + 1;
    }
    else if (document.getElementsByName('v1')[0].checked && document.getElementsByName('dc')[0].value !== '' && document.getElementsByName('dcn')[0].value === '') {
        errorMessage = errorMessage + 'ボイスチャットDiscordアカウントが記載されていません。\n';
        missCount = missCount + 1;
    }
    else if (document.getElementsByName('v1')[0].checked && document.getElementsByName('dc')[0].value === '' && document.getElementsByName('dcn')[0].value !== '') {
        errorMessage = errorMessage + 'ボイスチャットDiscordアカウントが記載されていません。\n';
        missCount = missCount + 1;
    }
    else if (document.getElementsByName('v1')[0].checked === false && document.getElementsByName('dc')[0].value !== '' && document.getElementsByName('dcn')[0].value !== '') {
        errorMessage = errorMessage + 'ボイスチャットPSアカウントのチェックが入っていません。\n';
        missCount = missCount + 1;
    }

    guardianCount = guardianCount + (document.getElementsByName('g0')[0].checked ? 1 : 0);
    guardianCount = guardianCount + (document.getElementsByName('g1')[0].checked ? 1 : 0);
    guardianCount = guardianCount + (document.getElementsByName('g2')[0].checked ? 1 : 0);
    if (guardianCount === 0) {
        errorMessage = errorMessage + '使用ガーディアンのいずれかを選択してください。\n';
        missCount = missCount + 1;
    }
}

function NGWordCheck() {
    let onePhrase = document.getElementsByName('m')[0].value;
    let ngWord = false;

    console.log(onePhrase);
    console.log(onePhrase.indexOf("<script>"));

    ngWord = onePhrase.indexOf("<script>") != -1 ? true :
    onePhrase.indexOf("<iframe>") != -1 ? true :
    onePhrase.indexOf("<form>") != -1 ? true :
    onePhrase.indexOf("<applet>") != -1 ? true :
    onePhrase.indexOf("<param>") != -1 ? true :
    onePhrase.indexOf("<frameset>") != -1 ? true :
    onePhrase.indexOf("<frame>") != -1 ? true :
    onePhrase.indexOf("<noframes>") != -1 ? true :
    onePhrase.indexOf("<INPUT") != -1 ? true :
    onePhrase.indexOf("<select>") != -1 ? true :
    onePhrase.indexOf("<option>") != -1 ? true :
    onePhrase.indexOf("<textarea>") != -1 ? true :
    onePhrase.indexOf("<html>") != -1 ? true :
    onePhrase.indexOf("<head>") != -1 ? true :
    onePhrase.indexOf("<body>") != -1 ? true :
    onePhrase.indexOf("<!--") != -1 ? true :
    onePhrase.indexOf("<title>") != -1 ? true :
    onePhrase.indexOf("<isindex>") != -1 ? true :
    onePhrase.indexOf("<base>") != -1 ? true :
    onePhrase.indexOf("<meta>") != -1 ? true :
    onePhrase.indexOf("<link>") != -1 ? true :
    onePhrase.indexOf("<a>") != -1 ? true :
    onePhrase.indexOf("<!doctype>") != -1 ? true :
    onePhrase.indexOf("<noscript>") != -1 ? true :
    
    onePhrase.indexOf("<SCRIPT>") != -1 ? true :
    onePhrase.indexOf("<IFRAME>") != -1 ? true :
    onePhrase.indexOf("<FORM>") != -1 ? true :
    onePhrase.indexOf("<APPLET>") != -1 ? true :
    onePhrase.indexOf("<PARAM>") != -1 ? true :
    onePhrase.indexOf("<FRAMESET>") != -1 ? true :
    onePhrase.indexOf("<FRAME>") != -1 ? true :
    onePhrase.indexOf("<NOFRAMES>") != -1 ? true :
    onePhrase.indexOf("<INPUT") != -1 ? true :
    onePhrase.indexOf("<SELECT>") != -1 ? true :
    onePhrase.indexOf("<OPTION>") != -1 ? true :
    onePhrase.indexOf("<TEXTAREA>") != -1 ? true :
    onePhrase.indexOf("<HTML>") != -1 ? true :
    onePhrase.indexOf("<HEAD>") != -1 ? true :
    onePhrase.indexOf("<BODY>") != -1 ? true :
    onePhrase.indexOf("<TITLE>") != -1 ? true :
    onePhrase.indexOf("<ISINDEX>") != -1 ? true :
    onePhrase.indexOf("<BASE>") != -1 ? true :
    onePhrase.indexOf("<META") != -1 ? true :
    onePhrase.indexOf("<LINK") != -1 ? true :
    onePhrase.indexOf("<A>") != -1 ? true :
    onePhrase.indexOf("<!DOCTYPE>") != -1 ? true :
    onePhrase.indexOf("<NOSCRIPT>") != -1 ? true : false;

    if (ngWord) {
        errorMessage = errorMessage + '一言にNGワードが記載されています。';
        missCount = missCount + 1;
    }
}

function Share() {
    missCount = 0;
    errorMessage = '以下の項目を記入してください。\n\n';
    inputMissCount();
    NGWordCheck();

    if (missCount > 0) {
        alert(errorMessage);
        return;
    }
    let messageBox = document.getElementsByName('m')[0];
    messageBox.value = messageBox.value.split('\n').join('<br>');

    document.d2Card.submit();
}