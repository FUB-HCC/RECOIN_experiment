var list_entity_original, list_entity_edited, completeness;

//Initialisierung von Recoin mit JSON von Properties
function recoinInit(c) {
    //TODO jquery.ajax ()
    $.ajax({
      url: './data/astronaut-stats.json',
      dataType: 'json',
      async: false,
      success: function(data) {
        list_entity_original = data;
        list_entity_edited = list_entity_original;
        completeness = determineCompletenessLevel(list_entity_edited, 5);
        recoinRender(c);
      }
    });
}


//----------------------------- Recoin Calculations -------------------------------------------------------------------

//Calculate completeness and return percentage, level, and text. 
function determineCompletenessLevel(list_of_props, threshold) {
    var i = 0;
    var sumAbsences = 0;
    for (let currentProp of list_of_props) {
        if (i >= threshold) {
            break;
        }
        if (currentProp.presence == false) {
            sumAbsences = sumAbsences + currentProp.relevance;
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
        completenessText =  "fairly";
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
function impactOfEdits(list_entity_original, list_entity_edited) {
    return determineCompletenessLevel(list_entity_edited).percentage - determineCompletenessLevel(list_entity_original).percentage;
}

//Grade the Edits made by participancts:
function gradeEdits(list_entity_original, list_entity_edited) {
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
        console.log(obj.presence);
        if (obj.presence === false && counter < 10) {
            $('#recoinTable tbody').append('<tr><td><label><a href="https://www.wikidata.org/wiki/Property:'+ obj.property + '" target="_blank">' + obj.property + '</a></label></td><td>' + obj.name + '</td><td>' + obj.relevance + '%</td><td><div><i class="plus icon" id="'+ obj.name + '"onclick="addValue(this)"> </i></div></td></tr >');
            counter++;
        }
    });

    $('#recoinProgressbar').html("<img src='https://tools.wmflabs.org/recoin/progressbar/" + completeness.level + ".png'>");

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
    $(explanation).html("<div style='margin:1em; font-size:1em; font-family:sans-serif; max-width: 66%; line-height:1.4em;'>This entry is <span style='font-style:italic;color:#0645ad;'>" + currentCompleteness.text + "</span>, because it misses information about <span style='font-style:italic;'>" + arrayExplanation[0] + ", " + arrayExplanation[1] + ", " + arrayExplanation[2] + ", " + arrayExplanation[3] + ", " + arrayExplanation[4] + "</span>.</div>" );
    $(explanation).insertBefore($('#recoinv1Text'));
}


function renderRecoinRedesign() {
 //redesign!   
}

//----------------------------- Recoin Functions --------------------------------------------------------------------

//to do track if regular or recoin
function addValue(el) {
    var options = {
      url: function(phrase) {
        return "https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&search=";
        //return 'http://localhost:3000/data/astronaut-stats.json';
      },

      getValue: function(element) {
        return element.label;
      },

      ajaxSettings: {
        dataType: "json",
        method: "POST",
        data: {
          dataType: "json"
        }
      },

      preparePostData: function(data) {
        data.phrase = $(el).val();
        return data;
      },

      requestDelay: 400
    };

    var input = "<input type='text' id='"+ el.id + "'>";
    $(el).parent().closest('div').html(input).easyAutocomplete(options);
}

function recoinAddValue() {
    var allAddValues = $(".addValue");
    // Inserts an Input-Submit-field before clicked addValue-Div
    for (var i = 0; i < allAddValues.length; i++) {
        $(allAddValues[i]).click(function() {
            console.log("add Value");

            var newValue = document.createElement("div");
            $(newValue).addClass("valueBox").html("<input id=astronaut-stats type='text' name='newValue" + i + "'>  <input type='submit' value='Publish'>")

            $(newValue).insertBefore($(this).parent(".toolbarBox"));
            var property = $(newValue).parents(".statementBox").find(".propertyBox").text();
            var toolbarBox = $(newValue).parents(".statementBox").find(".toolbarBox");
            console.log("property", property)

            $(newValue).find('input:submit').click(function() {
                var value = $(this).parent().find('input').val();
                $.ajax({
                    type: 'POST',
                    url: "./api/event",
                    data: {
                        //toDo
                        property: property,
                        value: value
                    },
                    success: function(response) {
                        if (response.success) {
                            $("<div class='valueBox'>" + value + "</div>").insertBefore($(toolbarBox));
                            $(newValue).remove();
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                });
            });
        });
    }
}

//----------------------------- General Functions -------------------------------------------------------------------

//Hax0r function
function findWithAttribute(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
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

    $("#astronaut-stats").easyAutocomplete(options);
}

function callWikidataApi(e) {
    console.log("wikidata auotocomplete wiht:" + e.value);
}


function recoinAddStatement(newStatement) {
    var oldStatementKey = findWithAttribute(list_entity_edited, 'name', newStatement.name);
    if (list_entity_edited[oldStatementKey].presence == false) {
        list_entity_edited.setAttribute('presence', true);
    }
    determine_completeness_level(list_entity_edited);
    //TODO render recoin with the new completeness level
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
