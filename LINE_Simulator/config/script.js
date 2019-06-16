const PLACEHOLDER_PATH = "config/placeholders/no-avatar.svg";

class interfaceController{
  constructor(textSimulator){
    this.self= this;
    this.talkMode = "auto";
    this.peopleCounter = 2;
    this.maxWaitTime = 10;
    this.textSimulator = textSimulator;
  };

  initEventListerners(){
    var thisController = this.self
    var peopleCounter = this.peopleCounter;
    //console.log("check count  :",this.peopleCounter);
    //console.log("initialized controller:", thisController);
    $('#add-person-form').click(function(){thisController._addPersonForm(); thisController._addTalkFormCol();thisController._updateEventListeners();thisController.peopleCounter +=1;});
    $('#add-talk-form').click(function(){thisController._addTalkForm(); thisController._updateEventListeners()});
    $('#create-talk').click(function(){thisController._createTalkScreen()});
    $('#talk-mode-selector').change(function(){thisController._switchTalkMode()});

    $(".delete-person-form").each(function(){
      $(this).click(function(){thisController._deleteTalkFormCol($(this).parent().find(".person-name-input")); thisController.peopleCounter -= 1;});
      $(this).click(thisController._deletePersonForm);
    });

    $(".delete-talk-form").each(function(){
      $(this).click(thisController._deleteTalkForm);
    });

    $('.img-input').each(function(){
      $(this).change(thisController._displayImgPreview);
    });

    $(".person-name-input").each(function(){
      $(this).change(thisController._addTalkFormLabel);
      thisController._updateEventListeners();
    });

  };

  _updateEventListeners(){
    // console.log("Updating event listeners")
    var thisController = this.self;
    $(".delete-person-form").each(function(){
      $(this).off();
      $(this).click(function(){thisController._deleteTalkFormCol($(this).parent().find(".person-name-input")); thisController.peopleCounter -= 1;});
      $(this).click(thisController._deletePersonForm);
    });

    $(".delete-talk-form").each(function(){
      $(this).off();
      $(this).click(thisController._deleteTalkForm);
    });

    $('.img-input').each(function(){
      $(this).off();
      $(this).change(thisController._displayImgPreview);
    });

    $(".person-name-input").each(function(){
      $(this).off();
      $(this).change(function(){thisController._addTalkFormLabel();thisController._updateEventListeners();});
    });
  };

  setTextSimulator(simulator){
    this.textSimulator = simulator;
  };

  _displayImgPreview(){
    //console.log("input:", $(this).parent().find(".img-input"));
    //console.log("FILES:", $(this).get(0).files);
    var fileList = $(this).get(0).files;
    var blobUrl = window.URL.createObjectURL(fileList[0]) ;
    //console.log("url:", blobUrl);
    $(this).parent().children(".person-img").attr("src", blobUrl);
    //var $input = $(this).parent().find(".img-input");
    };



  _switchTalkMode(){
    this.talkMode = $("input[name='simulation-type']:checked").val();
    $(".wait-time-selector").empty();
    if (this.talkMode === "click"){
      var nonChoiceTab = document.createElement("option");
      var textNode = document.createTextNode("---");
      nonChoiceTab.appendChild(textNode);
      nonChoiceTab.setAttribute("value", "none");
      $(".wait-time-selector").append(nonChoiceTab)
    }
    else {
      for (var i=1; i <= this.maxWaitTime; i++){
        var optionNode = document.createElement("option");
        var textNode = document.createTextNode(i + "秒");
        optionNode.appendChild(textNode);
        optionNode.setAttribute("value", i);
        $(".wait-time-selector").append(optionNode);
      };
    };
  };

  _addPersonForm(){
    //console.log("addPersonForm called:");
    $("#people-form").append('<div class="person-info"><label class="person-img-uploader"><img src="config/placeholders/no-avatar.svg" class="person-img"><input type="file" class="img-input" accept="image/*" /></label><span class="guide-text">人物名: </span><input type="text" class="form person-name-input" name="person-name" maxlength="15" placeholder="未設定"><span class="guide-text"><input type="radio" name="main-user">メインのユーザーとして指定</span><span class="css-cancel delete-person-form">×</span><br></div>')
  };

  _addTalkFormLabel(){
    //console.log("addLabel")
    var personForms = Array.from(document.getElementsByClassName("person-name-input"));
    var nameArr = [];
    personForms.forEach(function(input, i){
      //console.log("NAME:", input.value);
      nameArr.push(input.value);
    });
    $(".person-name-label").each(function(i){
      if (nameArr[i] == ""){$(this).html("人物名未設定");}
      else {$(this).html(nameArr[i]);};
    });
  };

  _addTalkFormCol(){
    var tdTextInput = document.createElement("td");
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.className += "table-cell";
    tdTextInput.appendChild(input);
    $(".data-row").append(tdTextInput);
    var thNameLabel = document.createElement("th");
    var textNode = document.createTextNode("人物名未設定")
    thNameLabel.appendChild(textNode);
    thNameLabel.setAttribute("scope", "col");
    thNameLabel.className = "person-name-label";
    $(".label-row").append(thNameLabel);

  };

  _addTalkForm(){
    //console.log("add-talk");
    var tbody = $(".table tbody");
    var tr = document.createElement("tr");
    tr.className += "data-row";

    var tdArray = [];

    var thDeleteButton = document.createElement("th");
    var span = document.createElement("span");
    span.className += "css-cancel ";
    span.className += "delete-talk-form";
    span.innerText = "×";
    thDeleteButton.appendChild(span);
    tr.appendChild(thDeleteButton);

    var thWaitTimeSelector = document.createElement("th");
    var select = document.createElement("select");
    select.className += "wait-time-selector"
    for (var i=1; i <= this.maxWaitTime; i++){
      var option = document.createElement("option");
      option.innerHTML = i + "秒";
      option.value = i;
      select.appendChild(option);
    };
    thWaitTimeSelector.appendChild(select);
    tr.appendChild(thWaitTimeSelector);

    for (var i=0; i < this.peopleCounter; i++){
      var tdTextInput = document.createElement("td");
      var input = document.createElement("input");
      input.setAttribute("type", "text");
      input.className += "table-cell";
      tdTextInput.appendChild(input);
      tr.appendChild(tdTextInput);
    };
    tbody.append(tr);

  };

  _deletePersonForm(){
    //console.log("Deleting:", $(this));
    $(this).parent().remove();
  };

  _deleteTalkForm(){
    //console.log("Deleting:", $(this));
    $(this).parent().parent().remove();
  };

  _deleteTalkFormCol(associatedNameInput){
    //Find the target index of the person that will be deleted
    var personNameInputs = Array.from($(".person-name-input"));
    var targetIndex;
    personNameInputs.forEach(function(input, i){
      if (input.isSameNode(associatedNameInput.get(0))){
        targetIndex = i;
      };
    });

    //Delete name label based on the targetIndex
    var nameLabels = Array.from($(".person-name-label"));
    nameLabels[targetIndex].remove();

    //Delete input table cells based on the targetIndex
    var dataRows = Array.from($(".data-row"));
    dataRows.forEach(function(row, i){
      var inputCells = $(row).find("td");
      inputCells[targetIndex].remove();
    });
  };
  _createTalkScreen(){
    this.textSimulator.initManagers();
    this.textSimulator.loadData();
    this.textSimulator.startSimulation();
  };
};

class Person{
  constructor(name, blobUrl, isMainPerson){
    this.imgBlobUrl = blobUrl;
    this.name = name;
    this.isMainPerson = isMainPerson;
  };
};

class Talk{
  constructor(speaker, phrase, waitTime){
    this.speaker = speaker;
    this.phrase = phrase;
    this.waitTime = waitTime;
  };
};

class TalkManager{
  constructor(peopleManager){
    this.self = this;
    this.talkList = [];
    this.talkTitle;
    this.talkMode;
    this.peopleManager = peopleManager;
  };

  getTalkList(){
    return this.talkList;
  };

  dataIsReady(){
    return this._isValidInput();
  };

  loadTalks(){
    var peopleManager = this.peopleManager;
    if (this.self._isValidInput){
      var newTalkList = [];
      var $dataRows = $(".data-row");
      $dataRows.each(function(i, row){
          //Get wait time
          var waitTime;
          var waitTimeTh = $(row).find("th")[1]
          var waitTime = $(waitTimeTh).find("select").val();
          // console.log($(form).find("th")[1].value)
          //Get phrase
          var phrase;
          var personIndex;
          var $phraseTds = $(row).find("td");

          $phraseTds.each(function(i, td){
            var phraseInput = $(td).children()[0];

            // console.log(phraseInput.value)
            // console.log("phraseInput.value != ''", phraseInput.value != "")
            if (phraseInput.value != ""){
              phrase = phraseInput.value;
              personIndex = i;
            };
          });
          // console.log("-----------")

          //get speaker
          var person = peopleManager.getPerson(personIndex);
          var talk = new Talk(person, phrase, waitTime);
          newTalkList.push(talk);
        });
      this.talkMode = $("input[name='simulation-type']:checked").val();
      this.talkTitle = $("input[name='talk-title']").val();
      this.talkList = newTalkList;
      };
  };

  _isValidInput(){
    errorMessage += "--------------------------------------------------\r\n"

    var errorMessage = "";
    var isValidInput = true;
    //Check if main-user button is checked
    if ($("input[name='main-user']:checked").length == 0){
      isValidInput = false;
      errorMessage += "メインのユーザーが指定されていません。\r\n"
    };

    //Check if talkTitle is entered:
    if ($("input[name='talk-title']").val() == ""){
      isValidInput = false;
      errorMessage += "トークタイトルが指定されていません。\r\n";
    };

    //Check person form inputs
    var $personForms = $(".person-name-input");
    $personForms.each(function(i, form){
      if (form.value === ""){
        isValidInput = false;
        errorMessage += "上から"+ (i+1) + "番目の人物名が設定されていません。\r\n";
      };
    });

    errorMessage += "--------------------------------------------------\r\n"
    //Check talk form inputs
    var $dataRows = $(".data-row");
    $dataRows.each(function(i, row){
      var $tds = $(row).find("td");
      var phrasesInRow = [];
      $tds.each(function(i, td){
        var phrase = $(this).children()[0].value;
        if (phrase !== ""){
          phrasesInRow.push(phrase);
        };
      });
      if (phrasesInRow.length > 1){
        errorMessage += "上から"+ (i+1) + "行目のチャットに二人以上のセリフが設定されています。\r\n";
        isValidInput = false;
      }
      else if (phrasesInRow.length == 0) {
        errorMessage += "上から"+ (i+1) + "行目のチャットにセリフが設定されていません。\r\n";
        isValidInput = false;
      };
    });
    if (!isValidInput){window.alert(errorMessage);};
    if (isValidInput){this.isReady = true;};
    return isValidInput;
  };

  setPeopleManager(peopleManager){
    this.peopleManager = peopleManager;
  };

};

class PeopleManager{
  constructor(){
    this.peopleList = [];
  };

  getPeopleList(){
    return this.peopleList;
  };

  getPerson(index){
    return this.peopleList[index]
  };

  loadPeople(){
    var newPeopleList = [];
    var $peopleForms = $(".person-info");
    $peopleForms.each(function(i, row){
      var blobUrl;
      var personName;
      //Get thumbnail
      var $imgInput = $(row).find(".img-input");
      var fileList = $imgInput.get(0).files;
      // console.log("filelist", fileList);
      if (fileList.length === 0){
        blobUrl = PLACEHOLDER_PATH;
      }else{
        blobUrl = window.URL.createObjectURL(fileList[0]);
      };
      // console.log("url:", blobUrl)
      //Get name
      var $nameInput = $(row).find(".person-name-input");
      var personName = $nameInput.val();
      //get isMainPerson
      var isMainPerson;
      if ($(this).find('input[name="main-user"]:checked').length == 1){isMainPerson = true;}

      var person = new Person(personName, blobUrl, isMainPerson);
      newPeopleList.push(person);
    });
    this.peopleList = newPeopleList;
  };

};


class TextSimulator{
  constructor(peopleManager, talkManager){
    this.self = this;
    this.peopleManager = peopleManager;
    this.talkManager = talkManager;
    this.dataReady = false;
    this.currentTalkIndex = 0;
    this.timeOutObjList = [];
  };

  setPeopleManager(peopleManager){
    this.peopleManager = peopleManager;
  };

  setTalkManager(talkManager){
    this.talkManager = talkManager;
  };

  initManagers(){
    this.talkManager.setPeopleManager(this.peopleManager);
  };

  loadData(){
    this.peopleManager.loadPeople();
    this.talkManager.loadTalks();
  };

  startSimulation(){
    var thisSimulator = this.self;
    $(".line__title").text(thisSimulator.talkManager.talkTitle);
    if (this.talkManager.dataIsReady()){
      console.log("Start constructing messenger:", this.talkManager);
      $(".line__contents").empty();
      $("#simulator-screen").get(0).style.display = "block";
      $("#setting-screen").get(0).style.display = "none";
      $("#go-back-to-setting").click(function(){thisSimulator._goBackToSettings()});
      //console.log("mode=", this.talkManager.talkMode)
      $("#process").off();
      if (this.talkManager.talkMode == "auto"){
        $("#process").click(function(){thisSimulator._startAutoMode()});
      }else{
        $("#process").click(function(){thisSimulator._startClickMode()});
      };

    }else{
       console.log("Data not ready");
     };
  };

  _goBackToSettings(){
    console.log("goBackToSettings");
    $("#simulator-screen").get(0).style.display = "none";
    $("#setting-screen").get(0).style.display = "block";
    $("#process").removeClass("disabled");
    this.timeOutObjList.forEach(function(timeOutObj){
      clearTimeout(timeOutObj);
    });
  };

  _showEachTalk(talk){
    var $messageContent = $(".line__contents");
    var outsideContainerClass;
    var chatContainerClass;
    if (talk.speaker.isMainPerson == true){
      outsideContainerClass = "line__right";
      chatContainerClass = "line__right-text"
    }
    else{
      outsideContainerClass = "line__left";
      chatContainerClass = "line__left-text"
    };

    var outsideContainer = document.createElement("div");
    outsideContainer.className += outsideContainerClass;
    var figure = document.createElement("figure");
    var img =document.createElement("img");
    img.setAttribute("src", talk.speaker.imgBlobUrl);
    var chatContainer = document.createElement("div");
    chatContainer.className += chatContainerClass;

    var nameContainer = document.createElement("div");
    nameContainer.className += "name";
    nameContainer.innerText = talk.speaker.name;
    var textContainer = document.createElement("div");
    textContainer.className += "text";
    // textContainer.innerText = talk.phrase;
    var innerTextContainer = document.createElement("div");
    innerTextContainer.className += "inner-right-text";
    innerTextContainer.innerText = talk.phrase;

    figure.appendChild(img);
    outsideContainer.appendChild(figure);
    textContainer.appendChild(innerTextContainer);
    chatContainer.appendChild(nameContainer);
    chatContainer.appendChild(textContainer);
    outsideContainer.appendChild(chatContainer);
    console.log("Node;", outsideContainer);
    $messageContent.append(outsideContainer);
    // window.scrollTo(0,document.querySelector(".line__contents").scrollHeight);
    //Scroll to the bottom
    var lineContents = document.getElementsByClassName("line__contents")[0];
    lineContents.scrollTop = lineContents.scrollHeight - lineContents.clientHeight;
  };

  _startAutoMode(){
    var thisSimulator = this.self;
    var timeOutObjList = this.timeOutObjList;
    //console.log("startAutoMode");
    var waitTimeSum = 0;
    $("#process").get(0).className += " disabled";
    $("#process").off();
    //console.log("className:", $("#process").get(0).className);
    this.talkManager.getTalkList().forEach(function(talk, i){
      var timeOutObj = setTimeout(thisSimulator._showEachTalk, 1000*talk.waitTime + waitTimeSum, talk);
      timeOutObjList.push(timeOutObj);
      waitTimeSum += 1000*talk.waitTime;
      //console.log("timeout:", 1000*talk.waitTime + waitTimeSum)
    });

  };

  _startClickMode(){
    $("#process").off();
    var currentTalkIndex = this.currentTalkIndex;
    var thisSimulator = this.self;
    thisSimulator._showEachTalk(thisSimulator.talkManager.talkList[currentTalkIndex]);
    currentTalkIndex += 1;
    //console.log("startClickMode");
    $("#process").click(function(){
      if ((thisSimulator.talkManager.talkList.length) > currentTalkIndex){
        thisSimulator._showEachTalk(thisSimulator.talkManager.talkList[currentTalkIndex]);
        currentTalkIndex += 1;
      };
      if (thisSimulator.talkManager.talkList.length == currentTalkIndex) {
        $("#process").get(0).className += " disabled";
        console.log("className:", $("#process").get(0).className);
        $("#process").off()
      }

    });

  };

  _wait(sec) {
    console.log("waiting")
        var objDef = new $.Deferred;

        setTimeout(function () {
            console.log("timeout")
        }, sec*1000);
        return objDef.promise();
    };

};
// function main(){
  var pm = new PeopleManager();
  var tm = new TalkManager(pm);
  var ts = new TextSimulator(pm, tm);
  var ic = new interfaceController(ts);
  ic.initEventListerners();

// };

// main();
