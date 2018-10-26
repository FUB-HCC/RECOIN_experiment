var list_entity_original, list_entity_edited, completeness, usedRecoin, condition, threshold,
    completenessColor;

//TODO replace with onload logic that calculates the correct recoin value
completeness = {
    "percentage": 33.46,
    "level": 1,
    "text": "very basic"
};

let jqueryAutocompleteValues;

//Initialisierung von Recoin mit JSON von Properties und autocomplete krams
function recoinInit(c) {
    threshold = 5;
    usedRecoin = false;
    condition = c;
    completenessColor = '#';
    $.ajax({
        url: './data/astronaut-stats.json',
        dataType: 'json',
        async: false,
        success: function (data) {
            list_entity_original = data;
            list_entity_edited = JSON.parse(JSON.stringify(data));
            completeness = determineCompletenessLevel(list_entity_edited, threshold);
        }
    });
    $.ajax({
        url: './data/astronaut-stats-jquery.json',
        dataType: 'json',
        success: function (data) {
            jqueryAutocompleteValues = data;
        }
    });

    recoinRender(condition);
}


//----------------------------- Recoin Calculations -------------------------------------------------------------------

//Calculate completeness and return percentage, level, and text. 
function determineCompletenessLevel(list_of_props, threshold) {
    var i = 0;
    var completenessPercentage = 0;
    var sumAbsences = 0;
    for (let currentProp in list_of_props) {
        if (i >= threshold) {
            break;
        }
        if (list_of_props[currentProp].presence == false) {
            sumAbsences = sumAbsences + list_of_props[currentProp].relevance;
            completenessPercentage = 100 - (sumAbsences / threshold);
            i++;
        }
    }
    var completenessText, completenessLevel;

    if (completenessPercentage > 95) {
        completenessText = "very detailed";
        completenessLevel = 5;
    } else if (completenessPercentage > 90) {
        completenessText = "detailed";
        completenessLevel = 4;
    } else if (completenessPercentage > 75) {
        completenessText = "fair";
        completenessLevel = 3;
    } else if (completenessPercentage > 50) {
        completenessText = "basic";
        completenessLevel = 2;
    } else {
        completenessText = "very basic";
        completenessLevel = 1;
    }
    var completenessPackage = {
        "percentage": completenessPercentage,
        "level": completenessLevel,
        "text": completenessText
    };
    return completenessPackage;
}

function determineCompletenessLevelRedesign(personalLevel) {
    var completenessText, completenessLevel;

    if (personalLevel > 95) {
        completenessText = "very detailed";
        completenessLevel = 5;
    } else if (personalLevel > 90) {
        completenessText = "detailed";
        completenessLevel = 4;
    } else if (personalLevel > 75) {
        completenessText = "fair";
        completenessLevel = 3;
    } else if (personalLevel > 50) {
        completenessText = "basic";
        completenessLevel = 2;
    } else {
        completenessText = "very basic";
        completenessLevel = 1;
    }
    var completenessPackage = {
        "percentage": personalLevel,
        "level": completenessLevel,
        "text": completenessText
    };
    return completenessPackage;
}

//Calculate the impact participant contributions have made on completeness:
function impactOfEdits() {
    var completenessBefore = determineCompletenessLevel(list_entity_original, threshold);
    var completenessAfter = determineCompletenessLevel(list_entity_edited, threshold);
    return completenessAfter.percentage - completenessBefore.percentage;
}

//Grade the Edits made by participancts:
function gradeEdits() {
    var percentage_contribution = impactOfEdits(list_entity_original, list_entity_edited);
    if (percentage_contribution > 33) {
        return "A";
    } else if (percentage_contribution > 20) {
        return "B";
    } else if (percentage_contribution > 10) {
        return "C";
    } else if (percentage_contribution > 5) {
        return "D";
    } else {
        return "F";
    }
}

//----------------------------- Recoin Renderings -------------------------------------------------------------------

//DOM manipulation
function recoinRender(condition) {
    condition = parseInt(condition);
    switch (condition) {
        case 1:
            return;
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
            $('#recoinTable tbody').append('<tr><td><label><a href="https://www.wikidata.org/wiki/Property:' + obj.property + '" target="_blank">' + obj.property + '</a></label></td><td>' + obj.name + '</td><td>' + obj.relevance + '%</td><td><div><i class="plus icon" id="' + obj.name + '"onclick="recoinPlus(this)"> </i></div></td></tr >');
            counter++;
        }
    });

    $('#recoinProgressbar').html("<a href='https://www.wikidata.org/wiki/Wikidata:Recoin' target='_blank'><img src='https://tools.wmflabs.org/recoin/progressbar/" + completeness.level + ".png' id='progressbarImg' title='This page provides a " + completeness.text + " amount of information.'></a>");

    console.log(c);
    if (c == 5) {
        generateRecoinExplanation();
    }
}

function generateRecoinExplanation() {
    var i = 0;
    var arrayExplanation = [];
    for (let currentPropKey in list_entity_edited) {
        if (i >= threshold) {
            break;
        }
        if (list_entity_edited[currentPropKey].presence == false) {
            arrayExplanation.push({ "name": list_entity_edited[currentPropKey].name, "relevance":list_entity_edited[currentPropKey].relevance});
            i++;
        }
    }
    var explanation = document.createElement("div");
    $(explanation).html("<div id='recoinExplanation' style='margin:1em; font-size:1em; font-family:sans-serif; max-width: 50%; line-height:1.4em;'>This entry is <span style='font-style:italic;'>" + completeness.text + "</span>, because it misses information about <span style='font-style:italic;'>" + arrayExplanation[0].name+ " ("+ arrayExplanation[0].relevance + "% relevant for astronauts), " + arrayExplanation[1].name + " ("+ arrayExplanation[1].relevance + "%), " +  arrayExplanation[2].name + " ("+ arrayExplanation[2].relevance + "%), " + arrayExplanation[3].name  + " ("+ arrayExplanation[3].relevance + "%), <span style='font-style:normal;'>and</span> " + arrayExplanation[4].name + " ("+ arrayExplanation[4].relevance + "%)</span>.</div>");
    $(explanation).insertBefore($('#recoinAccordion'));
}

function renderRecoinRedesign() {
    $('.ui.accordion').accordion();
    var limit = 0;
    $.each(list_entity_edited, function (i, obj) {
        if (obj.presence === false) {
            $('#recoinv2table tbody').append(`<tr class="item">
            <td style="width: 10%"> <div class="ui fitted checkbox">
            <input type="checkbox" class="personalCompleteness" value="`+ obj.relevance + `">
            <label></label>
          </div>
           </td>
            <td style="width: 25%"><a href="https://www.wikidata.org/wiki/Property:`+ obj.property + `" target="_blank">` + obj.name + `</a></td>
           
            <td style="width: 40%" id="` + obj.name.replace(/\s/g, "-") +  `Field"><div style="min-width:66%;" class="ui input" >
            <input type="text" id="` + obj.name.replace(/\s/g, "-") +  `Input" oninput="recoinRedesignInput(this)">
            <div class="" id="` + obj.name.replace(/\s/g, "-") +  `" data-prop="` + obj.name + `" style="cursor:pointer; font-size:0.8em; padding: 0.5em;"onclick="recoinRedesignValue(this)">add value</div>
        </div></td>
           <td style="width: 35%">
                <div class="ui tiny progress" style="background: white">
                <div class=" bar" style="width:` + Math.round(obj.relevance) + `% ;background-color: #8BBD9B;"></div>
                <div class="label" id="propertyprogressbar" value="`+ obj.amount + `"> Present for `+ obj.amount + ` other astronauts
                </div>
            </div></td>
         <td style="width: 5%"> 
         </td>
        </tr>`);
            limit++;
        }
    });

    var allRows = $('tr.item');

    for(var i = 0; i < threshold; i++) {
        var checkBox = $(allRows[i]).find('.personalCompleteness');
        $(checkBox).attr('checked','checked');
    }

    // for
    //accordion text
    $("#progressBarRecoinAccordionText").html(`This Astronaut is <span style="font-style:italic;color:#389867">` + completeness.text + `</span> by comparison.`);

    //progress bar accordion
    $("#progressBarRecoinAccordionBar").append(`<div class="ui tiny progress" style="width: 100%"><div class="progress" style="background: white"></div> <div class="bar" style="width:` + completeness.level + `0% ;background-color: #8BBD9B;"></div>`);

    $("#slider-range").slider({
        classes: {
            "ui-slider-range": "ui-corner-all ui-widget-header"
        },
        range: true, 
        min: 0,
        max: 819,
        step: 1,
        values:[0,819],
        slide: function( event, ui ) {
            var table = document.getElementById("recoinv2table");
            for (var i = 1, row; row = table.rows[i]; i++) {
               for (var j = 0, col; col = row.cells[j]; j++) {
                   if (j == 3) {             // if progressbar column
                        var currentRow = $(row.cells[j]).children();
                        var tinyProgressbar = $(currentRow).children()[1];
                        var value = $(tinyProgressbar).attr("value");
                        if (value >= ui.values[ 0 ] && value <= ui.values[ 1 ]) {
                           $(row).show();
                        } else {
                           $(row).hide();
                        }
                    }
                }  
            }
            $("#min-price").html(ui.values[0]);
            $("#max-price").html(ui.values[1]);
        }
    });

    function paging(itemPerPage) {
            if ($(".ui.pagination.menu").length == 0)
                $('#recoinpagination').html('<div class="ui pagination menu"></div>');
            else {
                $(".ui.pagination.menu").remove();
                $('#recoinpagination').html('<div class="ui pagination menu"></div>');
            }
            rowsShown = itemPerPage;
            var rowsTotal = $('#recoinv2table tbody tr').length;
            var numPages = rowsTotal / rowsShown;
            for (i = 0; i < numPages; i++) {
                var pageNum = i + 1;
                $('.ui.pagination.menu').append('<a href="#/" class="item" rel="' + i + '">' + pageNum + '</a> ');
            }
            $('#recoinv2table tbody tr').hide();
            $('#recoinv2table tbody tr').slice(0, rowsShown).show();
            $('.ui.pagination.menu a:first').addClass('active');
            $('.ui.pagination.menu a').bind('click', function () {
                $('.ui.pagination.menu a').removeClass('active');
                $(this).addClass('active');
                var currPage = $(this).attr('rel');
                var startItem = currPage * rowsShown;
                var endItem = startItem + rowsShown;
                $('#recoinv2table tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
                    css('display', 'table-row').animate({ opacity: 1 }, 300);

            });
    }
    
    paging(10);
}

function calculateFromRedesign() {
        var result = $('input[class="personalCompleteness"]:checked'); //speichert alle checked checkboxen
        var personalCompletenessPackage;

        if (result.length > 0) { //min eine checkbox checked
            var resultRelevance = 0;
            result.each(function () {
                resultRelevance += parseFloat($(this).val()) //addiert alle relevancen der gewählten properties
            });

            var perslevel = 100 - (resultRelevance / result.length); //berechnet recoin wert

            personalCompletenessPackage = determineCompletenessLevelRedesign(perslevel); //ruft completeness auf und bestimmt den text
            console.log(personalCompletenessPackage);
        } else {
            $('#divResult').html("No Property selected"); //ausgabe falls button gedrückt aber nichts ausgewählt/checked
        }

        $("#progressBarRecoinAccordionText").html(`This Astronaut is <span style="font-style:italic;color:#389867">` + personalCompletenessPackage.text + `</span> by comparison.`);

        $("#progressBarRecoinAccordionBar").html(`<div class="ui tiny progress" style="width: 100%"><div class="progress" style="background: white"></div> <div class="bar" style="width:` + personalCompletenessPackage.level + `0% ;background-color: #8BBD9B;"></div>`);
}


function recoinRedesignInput(obj) {
    let liveInput = $(obj).val();

    let liveAutocompleteOptions = {
        minLength: 1,
        source: function (request, response) {
            var term = request.term;
            var url = 'https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&origin=*&search=' + term;
            var xhr = createCORSRequest('GET', url);
            xhr.onload = function () {
                var responseText = JSON.parse(xhr.responseText);
                var responseArray = [];
                for (let key in responseText.search) {
                    responseArray.push(responseText.search[key].label);
                }
                response(responseArray);
            };
            xhr.send();
        }
    };

    $(obj).autocomplete(liveAutocompleteOptions)
}

function recoinRedesignValue(obj) {
    let findThis = obj.id;
    let property = obj.dataset.prop;
    let addedValue = $(obj).parents().find("#" + findThis + "Input").val();

    let propertyIndex = findWithAttribute(list_entity_edited, "name", property);
    if (propertyIndex >= 0) {
        list_entity_edited[propertyIndex].presence = true;
        let currentProperty = list_entity_edited[propertyIndex];
        var data = {
            type: "trackingEvent",
            workerID: localStorage.getItem("workerID"),
            hitID: localStorage.getItem("hitID"),
            assignmentID: localStorage.getItem("assignmentID"),
            condition: localStorage.getItem("condition"),
            relevance: currentProperty.relevance,
            timestamp: Date.now(),
            value: addedValue,
            property: property,
            usedRecoin: true
        };

        //personalCompletenessPackage = determineCompletenessLevelRedesign(perslevel)
        completeness = determineCompletenessLevel(list_entity_edited, threshold);

        sendTrackingEvent(data, function (data) {
                console.log("successfuly send things to the api: " + JSON.stringify(data));
                $("#"+ findThis + "Field").html(addedValue);
                var newStatement = '<div class="box statementBox"><div class="propertyBox">' + property + '</div><div class="valueBox">' + addedValue + '</div><div class="toolbarBox"><div class="addValue" onclick="generalAddValue(this)">+ add value</div></div></div>';

                
                $(newStatement).insertBefore($("#addStatementBox"));

                //progress bar accordion
                $("#progressBarRecoinAccordionText").html(`This Astronaut is <span style="font-style:italic;color:#389867">` + completeness.text + `</span> by comparison.`);

                //progress bar accordion
                $("#progressBarRecoinAccordionBar").html(`<div class="ui tiny progress" style="width: 100%"><div class="progress" style="background: white"></div> <div class="bar" style="width:` + completeness.level + `0% ;background-color: #8BBD9B;"></div>`);
            },
            function (response) {
                alert("We're sorry, there was a problem connecting to the server. If this continues, please contact us at ikon-research@inf.fu-berlin.de");
                console.log(response);
            });
    } else {
        console.log("Couldn't find property in list_entity edited:" + property);
        alert("We couldn't find the property you were trying to add.");
    }

}


//----------------------------- Recoin Functions --------------------------------------------------------------------

function recoinPlus(obj) {
    //console.log(obj);
    let inputId = obj.id.replace(/\s/g, "-") + '-input-field';
    let input = "<input type='text' id='" + inputId + "'><input type='submit' value='Publish' data-claim='" + obj.id + "' onclick='recoinAddValue(this)'>";
    $(obj).parent().closest("div").append(input);

    let liveAutocompleteOptions = {
        minLength: 1,
        source: function (request, response) {
            var term = request.term;
            var url = 'https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&origin=*&search=' + term;
            var xhr = createCORSRequest('GET', url);
            xhr.onload = function () {
                var responseText = JSON.parse(xhr.responseText);
                var responseArray = [];
                for (let key in responseText.search) {
                    responseArray.push(responseText.search[key].label);
                }
                response(responseArray);
            };
            xhr.send();
        }
    };

    //console.log("Searching for id:" + inputId);
    $('#' + inputId).autocomplete(liveAutocompleteOptions);

    $(obj).remove();
}

function recoinAddValue(obj) {
    var property = obj.dataset.claim;
    var value = $(obj).parent().find('input').val();

    //TODO refactor into function addStatement(property, value, ...)
    let propertyIndex = findWithAttribute(list_entity_edited, "name", property);
    if (propertyIndex >= 0) {
        list_entity_edited[propertyIndex].presence = true;
        let currentProperty = list_entity_edited[propertyIndex];
        var data = {
            type: "trackingEvent",
            workerID: localStorage.getItem("workerID"),
            hitID: localStorage.getItem("hitID"),
            assignmentID: localStorage.getItem("assignmentID"),
            condition: localStorage.getItem("condition"),
            relevance: currentProperty.relevance,
            timestamp: Date.now(),
            value: value,
            property: property,
            usedRecoin: true
        };

        completeness = determineCompletenessLevel(list_entity_edited, threshold);

        sendTrackingEvent(data, function (data) {
                console.log("successfuly send things to the api: " + JSON.stringify(data));
                $(obj).parent().closest("div").html(value);
                var newStatement = '<div class="box statementBox"><div class="propertyBox">' + property + '</div><div class="valueBox">' + value + '</div><div class="toolbarBox"><div class="addValue" onclick="generalAddValue(this)">+ add value</div></div></div>';
                $(newStatement).insertBefore($("#addStatementBox"));
                $('#recoinTable tbody').empty();
                if (condition == 5) {
                    $('#recoinExplanation').remove();
                }
                recoinRender(condition);
                //$("<div class='valueBox'>" + value + "</div>").insertBefore($(toolbarBox));
                //$(newValue).remove();
            },
            function (response) {
                alert("We're sorry, there was a problem connecting to the server. If this continues, please contact us at ikon-research@inf.fu-berlin.de");
                console.log(response);
            });
    } else {
        console.log("Couldn't find property in list_entity edited:" + property);
        alert("We couldn't find the property you were trying to add.");
    }
}

let statementIdGenerator = 1;

//--------------- neue Statement-Box wird hinzugefügt---------------//
//TODO remove?
function addStatement() {
    statementIdGenerator++;
    var newStatement = document.createElement("div");
    let addStatementTextFieldId = "addStatementTextField" + statementIdGenerator;
    var input = "<div class='propertyBox new'><input id='" + addStatementTextFieldId + "' type='text' name='newProperty' class='addStatementTextField'></div>";
    $(newStatement).addClass("box").addClass("statementBox").html(input);
    $(newStatement).insertBefore($("#addStatementBox"));

//--------------- AUTOCOMPLETE JSON  ---------------//

    let astronaut_stats = jqueryAutocompleteValues;
    let addStatementJqueryElement = $("#" + addStatementTextFieldId);

    addStatementJqueryElement.autocomplete({
        source: astronaut_stats,
        minLength: 1,
        search: function (event, oUi) {
            // get current input value
            let searchValue = $(event.target).val();
            // init new search array
            let searchResults = [];
            // for each element in the main array ...
            $(astronaut_stats).each(function (iIndex, currentProperty) {
                // ... if element starts with input value
                if (currentProperty.label.substr(0, searchValue.length) == searchValue && currentProperty.presence == false) {
                    // add element
                    searchResults.push(currentProperty.label);
                }
            });
            // change search array
            $(this).autocomplete('option', 'source', searchResults);
        },
        select: function (event, ui) {
            let value = ui.item.label;
            let propertyBox = $(this).parents(".statementBox").find('.propertyBox');
            propertyBox.html(value);
            //This call adds the html for adding values to properties:
            addValue(newStatement);
        }
    });
    addStatementJqueryElement.keypress(function(e) {
        if(e.which == 13) {
            alert('Please only select option from the dropdown menus (which appear when you start typing)');
        }
    });

    if (condition != 1 && condition <= 5) {
        $('#recoinTable tbody').empty();
        recoinRender(condition);
    }
    if (condition == 5) {
        $('#recoinTable tbody').empty();
        $('#recoinExplanation').remove();
        recoinRender(condition);
    }

}

function addValue(obj) {
    $(obj).append("<div class='valueBox'><input id='wikidataApi' type='text' name='newValue'><input id='publish_statement_button' type='submit' value='✓ publish'><input id='cancel_statement_button' type='submit' value='X cancel'></div>");

    if (usedRecoin) {
        usedRecoin = false;
    }


    //Publishing the statement
    $(obj).find('#publish_statement_button').click(function () {
        var value = $(this).parents('.statementBox').find('input:text').val();
        var property = $(this).parents(".statementBox").find(".propertyBox").text();
        var valueBox = $(this).parents(".statementBox").find('.valueBox');
        valueBox.html(value);

        //TODO refactor into function addStatement(property,value,...)
        // find property by name: 		"name": "place of death",
        let propertyIndex = findWithAttribute(list_entity_edited, "name", property);
        if (propertyIndex >= 0 && list_entity_edited[propertyIndex].presence == false) {
            list_entity_edited[propertyIndex].presence = true;
            let currentProperty = list_entity_edited[propertyIndex];
            var data = {
                type: "trackingEvent",
                workerID: localStorage.getItem("workerID"),
                hitID: localStorage.getItem("hitID"),
                assignmentID: localStorage.getItem("assignmentID"),
                condition: localStorage.getItem("condition"),
                relevance: currentProperty.relevance,
                timestamp: Date.now(),
                value: value,
                property: property,
                usedRecoin: usedRecoin
            };
            sendTrackingEvent(data, function (data) {
                    console.log("successfuly send things to the api: " + JSON.stringify(data));
                    $(obj).find(".propertyBox").removeClass("new");
                    $(obj).append('<div class="toolbarBox"><div class="addValue" onclick="generalAddValue(this)">+ add value</div></div>');
                },
                function (response) {
                    alert("We're sorry, there was a problem connecting to the server. If this continues, please contact us at ikon-research@inf.fu-berlin.de");
                    console.log(response);
                });
        } else {
            console.log("Couldn't find property in list_entity edited:" + property);
            alert("We couldn't find the property you were trying to add.");
        }
    });

    //Cancelling the statement
    $(obj).find('#cancel_statement_button').click(function () {
        $(obj).remove();
    });


    let liveAutocompleteOptions = {
        minLength: 1,
        source: function (request, response) {
            var term = request.term;
            var url = 'https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&origin=*&search=' + term;
            var xhr = createCORSRequest('GET', url);
            xhr.onload = function () {
                var responseText = JSON.parse(xhr.responseText);
                var responseArray = [];
                for (let key in responseText.search) {
                    responseArray.push(responseText.search[key].label);
                }
                response(responseArray);
            };
            xhr.send();
        }
    };

    $('#wikidataApi').autocomplete(liveAutocompleteOptions);
}

function generalAddValue(obj) {
    if (usedRecoin) {
        usedRecoin = false;
    }

    let newValue = "<div class='valueBox' id='newestValue'><input id='wikidataApi' type='text' name='newValue'><input id='publish_statement_button' type='submit' value='✓ publish'><input id='cancel_statement_button' type='submit' value='X cancel'></div>"
    $(obj).parents(".statementBox").find(".toolbarBox").before(newValue);

    //Publishing the new Value
    $(obj).parents(".statementBox").find("#publish_statement_button").click(function () {
        //this = publish button
        //obj = addValue button
        var value = $(this).siblings("#wikidataApi").val();
        var property = $(this).parents(".statementBox").find(".propertyBox").text();
        var valueBox = $(this).parents(".statementBox").find('#newestValue');
        valueBox.attr('id', value);

        //TODO refactor into function addStatement(property,value,...)
        // find property by name:       "name": "place of death",


        let propertyIndex = findWithAttribute(list_entity_edited, "name", property);
        if (propertyIndex >= 0) {
            list_entity_edited[propertyIndex].presence = true;
            let currentProperty = list_entity_edited[propertyIndex];
            var data = {
                type: "trackingEvent",
                workerID: localStorage.getItem("workerID"),
                hitID: localStorage.getItem("hitID"),
                assignmentID: localStorage.getItem("assignmentID"),
                condition: localStorage.getItem("condition"),
                relevance: currentProperty.relevance,
                timestamp: Date.now(),
                value: value,
                property: property,
                usedRecoin: false
            };
            sendTrackingEvent(data, function (data) {
                    console.log("successfuly send things to the api: " + JSON.stringify(data));
                    valueBox.html(value);
                },
                function (response) {
                    alert("We're sorry, there was a problem connecting to the server. If this continues, please contact us at ikon-research@inf.fu-berlin.de");
                    console.log(response);
                });
        } else {
            console.log("Couldn't find property in list_entity edited:" + property);
            alert("We couldn't find the property you were trying to add.");
        }
    });

    //Cancelling the new Value
    $(obj).parents(".statementBox").find('#cancel_statement_button').click(function () {
        $('#newestValue').remove();
    });

    let liveAutocompleteOptions = {
        minLength: 1,
        source: function (request, response) {
            var term = request.term;
            var url = 'https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&origin=*&search=' + term;
            var xhr = createCORSRequest('GET', url);
            xhr.onload = function () {
                var responseText = JSON.parse(xhr.responseText);
                var responseArray = [];
                for (let key in responseText.search) {
                    responseArray.push(responseText.search[key].label);
                }
                response(responseArray);
            };
            xhr.send();
        }
    };

    $('#wikidataApi').autocomplete(liveAutocompleteOptions);
}

//----------------------------- General Functions -------------------------------------------------------------------

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
