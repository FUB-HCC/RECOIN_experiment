var list_entity_original, list_entity_edited, completeness, usedRecoin, condition, liveAutocompleteOptions, threshold, completenessColor;

//Initialisierung von Recoin mit JSON von Properties
function recoinInit(c) {
    //TODO jquery.ajax ()
    usedRecoin = false;
    condition = c;
    completenessColor = '#'
    $.ajax({
      url: './data/astronaut-stats.json',
      dataType: 'json',
      async: false,
      success: function(data) {
        list_entity_original = data;
        list_entity_edited = list_entity_original;
        completeness = determineCompletenessLevel(list_entity_edited, 5);
        }
    });
    recoinRender(condition);
}


//----------------------------- Recoin Calculations -------------------------------------------------------------------

//Calculate completeness and return percentage, level, and text. 
function determineCompletenessLevel(list_of_props, threshold) {
    var i = 0;
    var sumAbsences = 0;
    for (let currentProp in list_of_props) {
        if (i >= threshold) {
            break;
        }
        if (list_of_props[currentProp].presence == false) {
            sumAbsences = sumAbsences + list_of_props[currentProp].relevance;
            i++;
        }
    }
    var completenessPercentage = 100 - (sumAbsences / threshold);
    var completenessText, completenessLevel;

    if (completenessPercentage > 95) {
        completenessText =  "very detailed";
        completenessLevel = 5;
    } else if (completenessPercentage > 90) {
        completenessText =  "detailed";
        completenessLevel = 4;
    } else if (completenessPercentage > 75) {
        completenessText =  "fair";
        completenessLevel = 3;
    } else if (completenessPercentage > 50) {
        completenessText =  "basic";
        completenessLevel = 2;
    } else {
        completenessText =  "very basic";
        completenessLevel = 1;
    }
    var completenessPackage = {"percentage": completenessPercentage, "level": completenessLevel, "text": completenessText};
    return completenessPackage;
}

//Calculate the impact participant contributions have made on completeness:
function impactOfEdits() {
    var completenessBefore = determineCompletenessLevel(list_entity_original, 5);
    var completenessAfter= determineCompletenessLevel(list_entity_edited, 5);
    return completenessBefore.percentage - completenessAfter.percentage;
}

//Grade the Edits made by participancts:
function gradeEdits() {
    var percentage_contribution = impactOfEdits(list_entity_original, list_entity_edited);
    if (percentage_contribution > 50) {
        return "A";
    } else if (percentage_contribution > 30) {
        return "B";
    } else if (percentage_contribution > 20) {
        return "C";
    } else if (percentage_contribution > 10) {
        return "D";
    } else {
        return "F";
    }
}

//----------------------------- Recoin Renderings -------------------------------------------------------------------

//DOM manipulation
function recoinRender(condition) {
    switch (condition) {
        case 1:
        return
        break;
        case 2:
        renderRecoinOriginal(condition);
        break;
        case 3:
        renderRecoinOriginal(condition);
        break;
        case 4:
        renderRecoinOriginal(condition);
        break;
        case 5:
        renderRecoinOriginal(condition);
        break;
        case 6:
        renderRecoinRedesign();
    }
}

function renderRecoinOriginal(c) {
    $('.ui.accordion').accordion();
    var counter = 0;
    $.each(list_entity_edited, function (i, obj) {
        if (obj.presence === false && counter < 10) {
            $('#recoinTable tbody').append('<tr><td><label><a href="https://www.wikidata.org/wiki/Property:'+ obj.property + '" target="_blank">' + obj.property + '</a></label></td><td>' + obj.name + '</td><td>' + obj.relevance + '%</td><td><div><i class="plus icon" id="'+ obj.name + '"onclick="recoinPlus(this)"> </i></div></td></tr >');
            counter++;
        }
    });

    $('#recoinProgressbar').html("<a href='https://www.wikidata.org/wiki/Wikidata:Recoin' target='_blank'><img src='https://tools.wmflabs.org/recoin/progressbar/" + completeness.level + ".png' id='progressbarImg' title='This page provides a "+ completeness.text + " amount of information.'></a>");

    if(c == 5) {
        generateRecoinExplanation(list_entity_edited);
    }
}

function generateRecoinExplanation(list_of_props) {
    var currentCompleteness = determineCompletenessLevel(list_of_props, 5);
    var i = 0;
    var arrayExplanation = [];
    for (let currentProp of list_of_props) {
      if (i >= 5) {
          break;
      }
      if (currentProp.presence == false) {
          arrayExplanation.push(currentProp.name);
          i++;
      }
  }
  var explanation = document.createElement("div");
  $(explanation).html("<div id='recoinExplanation' style='margin:1em; font-size:1em; font-family:sans-serif; max-width: 50%; line-height:1.4em;'>This entry is <span style='font-style:italic;color:#0645ad;'>" + currentCompleteness.text + "</span>, because it misses information about <span style='font-style:italic;'>" + arrayExplanation[0] + ", " + arrayExplanation[1] + ", " + arrayExplanation[2] + ", " + arrayExplanation[3] + ", <span style='font-style:normal;'>and</span> " + arrayExplanation[4] + "</span>.</div>" );
  $(explanation).insertBefore($('#recoinAccordion'));
}


function renderRecoinRedesign() {
 //redesign!   
}

//----------------------------- Recoin Functions --------------------------------------------------------------------


function recoinPlus(obj) {
    var newValue;
    var input = "<input type='text' id='newValue' class='"+ obj.id + "' onchange='manageWikiAutocompletion(this)' oninput='callWikidataApi(this)'><input type='submit' value='Publish' onclick='recoinAddValue(this)'>";
    $(obj).parent().closest("div").append(input);
    $(obj).remove(); 
}

function recoinAddValue(obj) {
    //var property = $(obj).siblings('input')["0"].attr('data-property');
    var property = $(obj).siblings('input')["0"];
    var value = $(obj).parent().find('input').val();
    property = $(property).attr('class');


    //var newStatementKey = findWithAttribute(list_entity_edited, 'name', property);
    //var relevanceOfAddedProperty = list_entity_edited[newStatementKey].relevance;

    usedRecoin = true;

    addStatement(property);
    $(obj).parent().closest("div").html(value);
            // $.ajax({
            //     type: 'POST',
            //     url: "./api/event",
            //     data: {
            //             //toDo

            //             property: property,
            //             value: value,
            //               condition: condition,
            //               relevance: completeness.percentage,
            //         },
            //         success: function(response) {
            //             if (response.success) {

            //             }
            //         },
            //         error: function(XMLHttpRequest, textStatus, errorThrown) {
            //             alert("Oh no! There was an error on the server side. Please contact us at: ikon-research@inf.fu-berlin.de.");
            //         }
            //     });
    //    });
    usedRecoin = false;
}


//Sajeera
function addStatementInput(obj) {
    var newStatement = document.createElement("div");

    var input = "<div class='propertyBox'><input type='text' name='newValue'>  <input  type='submit' value='Publish'></div><div class='valueBox'></div><div class='toolbarBox'><div class='addValue'>+ add value</div></div>";

    $(obj).addClass("box").addClass("statementBox").html(input);
    $(newStatement).insertBefore($("#addStatementBox"));
}

function addStatement(newStatement) {
    var oldStatementKey = findWithAttribute(list_entity_edited, 'name', newStatement);
    if (list_entity_edited[oldStatementKey].presence == false) {
        list_entity_edited[oldStatementKey].presence = true;
    }
    completeness = determineCompletenessLevel(list_entity_edited, 5);
    if(condition != 1 && condition <= 5) {
        $('#recoinProgressbar').html("<a href='https://www.wikidata.org/wiki/Wikidata:Recoin' target='_blank'><img src='https://tools.wmflabs.org/recoin/progressbar/" + completeness.level + ".png' id='progressbarImg' title='This page provides a "+ completeness.text + " amount of information.'></a>");
    }
    if(condition == 5) {
        $('#recoinExplanation').remove();
        generateRecoinExplanation(list_entity_edited);
    }
}


//----------------------------- General Functions -------------------------------------------------------------------


function manageWikiAutocompletion(obj) {
    var tempJSON = [];
    var tempString = $(obj).attr("data-store");

    if(tempString != null) {
        tempJSON = tempString.split(",");
        console.log(tempJSON);
    }

    liveAutocompleteOptions = {
        data: tempJSON,
        requestDelay: 400,

        list: {
            match: {
                enabled: true
            }
        }
    }
}

function callPropertyAutocompletion(e) {
    var options = {
        url: "data/astronaut-stats.json",

        getValue: "name",

        list: {
            match: {
                enabled: true
            }
        }
    };

    //$("#astronaut-stats").easyAutocomplete(options);
}

function callWikidataApi(e) {
    var autocompleteOptions = [];
    var liveInput = $(e).val();
    var url = 'https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&origin=*&search=' + liveInput;
    
    var xhr = createCORSRequest('GET', url);

    xhr.onload = function () {
        var responseText = JSON.parse(xhr.responseText);
        for(let key in responseText.search) {
            autocompleteOptions.push(responseText.search[key].label);
        }
        $(e).attr("data-store", autocompleteOptions);
    };

    xhr.send();
    //$(".newValue").easyAutocomplete({data: $(".newValue").attr("data-store")});
}


function addStatementContainer() {
    let newStatementProperty = 'newStatementPropertyInput';
    let newStatementValueId = 'newStatementValueInput';
    return "<div class='propertyBox'>" +
    "<input type='text' id=" + newStatementProperty + " oninput='callPropertyAutocompletion(this)'>" +
    "</div>" +
    "<div class='valueBox'>" +
    "<input type='text' id=" + newStatementValueId + " oninput='callWikidataApi(this)'>" +
    "</div>" +
    "<div class='toolbarBox'><div class='addValue'>+ add value</div></div>";
}



// Create the XHR object.
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 400;
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

//Hax0r function
function findWithAttribute(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}
