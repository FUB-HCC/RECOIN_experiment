var list_entity_original, list_entity_edited, completeness, usedRecoin, condition, liveAutocompleteOptions, threshold,
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
    console.log(completenessPercentage);

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

//Calculate the impact participant contributions have made on completeness:
function impactOfEdits() {
    var completenessBefore = determineCompletenessLevel(list_entity_original, 5);
    var completenessAfter = determineCompletenessLevel(list_entity_edited, 5);
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
            $('#recoinTable tbody').append('<tr><td><label><a href="https://www.wikidata.org/wiki/Property:' + obj.property + '" target="_blank">' + obj.property + '</a></label></td><td>' + obj.name + '</td><td>' + obj.relevance + '%</td><td><div><i class="plus icon" id="' + obj.name + '"onclick="recoinPlus(this)"> </i></div></td></tr >');
            counter++;
        }
    });

    $('#recoinProgressbar').html("<a href='https://www.wikidata.org/wiki/Wikidata:Recoin' target='_blank'><img src='https://tools.wmflabs.org/recoin/progressbar/" + completeness.level + ".png' id='progressbarImg' title='This page provides a " + completeness.text + " amount of information.'></a>");

    if (c == 5) {
        generateRecoinExplanation();
    }
}

function generateRecoinExplanation() {
    var currentCompleteness = determineCompletenessLevel(list_entity_edited, threshold);
    console.log(currentCompleteness);
    var i = 0;
    var arrayExplanation = [];
    console.log(list_entity_edited);
    for (let currentProp in list_entity_edited) {
        if (i >= threshold) {
            break;
        }
        if (currentProp.presence == false) {
            arrayExplanation.push(currentProp.name);
            console.log(arrayExplanation);
            i++;
        }
    }
    var explanation = document.createElement("div");
    $(explanation).html("<div id='recoinExplanation' style='margin:1em; font-size:1em; font-family:sans-serif; max-width: 50%; line-height:1.4em;'>This entry is <span style='font-style:italic;color:#0645ad;'>" + currentCompleteness.text + "</span>, because it misses information about <span style='font-style:italic;'>" + arrayExplanation[0] + ", " + arrayExplanation[1] + ", " + arrayExplanation[2] + ", " + arrayExplanation[3] + ", <span style='font-style:normal;'>and</span> " + arrayExplanation[4] + "</span>.</div>");
    $(explanation).insertBefore($('#recoinAccordion'));
}


function renderRecoinRedesign() {
    var limit = 0;
    $.each(list_entity_edited, function (i, obj) {
        if (obj.presence === false) {
            $('#recoinv2table tbody').append('<tr><td style="width: 25%"><a href="https://www.wikidata.org/wiki/Property:' + obj.property + '" target="_blank">' + obj.name + '</a></td><td style="width: 40%"><div class="ui input" ><input type="text" placeholder=" "><div id="rv2addvalue">add value</div></div></td><td style="width: 35%"> <span>' + Math.round(obj.relevance) + ' %</span><div class="label" style="font-size: 14px; text-align: left">  ' + obj.amount + ' out of 819</div><div class="ui tiny progress" style="background: white"><div class=" bar" style="width:' + Math.round(obj.relevance) + '% ;background-color: #66B3BA;"></div></div></td></tr>');
            limit++;
        }
    });
    $('#recoinv2table').html('Hallo');


    //$("#progressBarRecoinAccordionText").append('div class="label">This Astronaut provides ' + completeness.text + ' information </div></div>');


    // function completenessBarLength(lvl) {
    //     switch(lvl) {
    //         case 5:
    //             return '100%'
    //             break;
    //         case 4:
    //             return '75%'
    //             break;
    //         case 3:
    //             return '50%'
    //             break;
    //         case 2:
    //             return '25%'
    //             break;
    //         case 1:
    //             return '5%'
    //             break;
    //     }
    // }

    // var barLength = completenessBarLength(completeness.level);

    // //progress bar accordion                                             
    // $("#progressBarRecoinAccordionBar").append('<div class="ui small blue progress" style="width: 25%;"><div class="progress" style="background: white"></div> <div class="bar" style="width:' + barLength + '% ;background-color: #66B3BA;"></div>');

    // $("#tableüberschrift").append('<div class="label">'+ limit + ' of ' + list_entity_edited.length + ' properties were not added for this astronaut</div></div>');

    // /*pagination recoinv2*/

    // var rowsShown;

    // function paging(itemPerPage) {
    //     if ($(".ui.pagination.menu").length == 0)
    //         $('#recoinpagination').after('<div class="ui pagination menu"></div>');
    //     else {
    //         $(".ui.pagination.menu").remove();
    //         $('#recoinpagination').after('<div class="ui pagination menu"></div>');
    //     }
    //     rowsShown = itemPerPage;
    //     var rowsTotal = $('#recoinv2table tbody tr').length;
    //     var numPages = rowsTotal / rowsShown;
    //     for (i = 0; i < numPages; i++) {
    //         var pageNum = i + 1;
    //         $('.ui.pagination.menu').append('<a href="#/" class="item" rel="' + i + '">' + pageNum + '</a> ');
    //     }
    //     $('#recoinv2table tbody tr').hide();
    //     $('#recoinv2table tbody tr').slice(0, rowsShown).show();
    //     $('.ui.pagination.menu a:first').addClass('active');
    //     $('.ui.pagination.menu a').bind('click', function () {

    //         $('.ui.pagination.menu a').removeClass('active');
    //         $(this).addClass('active');
    //         var currPage = $(this).attr('rel');
    //         var startItem = currPage * rowsShown;
    //         var endItem = startItem + rowsShown;
    //         $('#recoinv2table tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
    //             css('display', 'table-row').animate({ opacity: 1 }, 300);

    //     });
    // }

    // paging(10);


    // $("#firstButton").click(function () {
    //     paging(5);
    // });

    // $("#secondButton").click(function () {
    //     paging(10);
    // });

    // $("#thirdButton").click(function () {
    //     paging(15);
    // });

    // $("#allButton").click(function () {
    //     paging(limit);
    // });

    // /* multisliderrangerecoin*/

    // $("#slider-range").slider({
    //     range: true,
    //     min: 0,
    //     max: 819,
    //     values: [0, 819],
    //     slide: function (event, ui) {
    //         $("#amount").val("EXISTS FOR " + ui.values[0] + " OUT OF " + ui.values[1] + " ASTRONAUTS");
    //         $('#recoinv2table tbody tr').remove();
    //         $.each(data, function (i, obj) {
    //             if (obj.presence === false && obj.amount > ui.values[0] && obj.amount < ui.values[1]) {
    //                 $('#recoinv2table tbody').append('<tr>td style="width: 25%"><a href="https://www.wikidata.org/wiki/Property:'+ obj.property + '" target="_blank">' + obj.name + '</a></td><td style="width: 40%"><div class="ui input"><input type="text" placeholder=" "><div id="rv2addvalue">add value</div></div></td><td style="width: 35%"> <!--<span>' + Math.round(obj.relevance) + ' %</span>--><div class="label" style="font-size: 14px; text-align: left">  '+ obj.amount + ' out of 819</div> <div class="ui tiny progress" style="background: white" ><div class=" bar" style="width:' + Math.round(obj.relevance) + '%; background-color: #66B3BA;"></div></div></td></tr>');
    //             }
    //         });
    //         paging(rowsShown);
    //     }
    // });
    // $("#amount").val(" EXISTS FOR " + $("#slider-range").slider("values", 0) + " OUT OF " + $("#slider-range").slider("values", 1) + " ASTRONAUTS ");
    //$('.ui.accordion').accordion();
}

//----------------------------- Recoin Functions --------------------------------------------------------------------


function recoinPlus(obj) {
    var newValue;
    var input = "<input type='text' id='newValue' class='" + obj.id + "' onchange='manageWikiAutocompletion(this)' oninput='callWikidataApi(this)'><input type='submit' value='Publish' onclick='recoinAddValue(this)'>";
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
function getRelevance(property) {
    for (mProperty of list_entity_original) {
        if (mProperty.name == property) {
            return mProperty.relevance;
        }
        return 0
    }
}

//--------------- neue Statement-Box wird hinzugefügt---------------//

function addStatement() {
    var newStatement = document.createElement("div");
    var input = "<div class='propertyBox new'><input id='astronaut-stats' type='text' name='newProperty'></div>";
    $(newStatement).addClass("box").addClass("statementBox").html(input);
    $(newStatement).insertBefore($("#addStatementBox"));
//--------------- AUTOCOMPLETE JSON  ---------------//

    let astronaut_stats = jqueryAutocompleteValues;


    $('#astronaut-stats').autocomplete({
        source: astronaut_stats,
        minLength: 2,
        search: function (event, oUi) {
            // get current input value
            let searchValue = $(event.target).val();
            // init new search array
            let searchResults = [];
            // for each element in the main array ...
            $(astronaut_stats).each(function (iIndex, currentProperty) {
                // ... if element starts with input value
                if (currentProperty.label.substr(0, searchValue.length) == searchValue) {
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
            console.log(value);
        }
    });

    console.log(list_entity_edited);


//--------------- Re-Render-Recoin  ---------------//
    if (condition != 1 && condition <= 5) {
        $('#recoinProgressbar').html("<a href='https://www.wikidata.org/wiki/Wikidata:Recoin' target='_blank'><img src='https://tools.wmflabs.org/recoin/progressbar/" + completeness.level + ".png' id='progressbarImg' title='This page provides a " + completeness.text + " amount of information.'></a>");
    }
    if (condition == 5) {
        $('#recoinExplanation').remove();
        generateRecoinExplanation(list_entity_edited);
    }
}

//--------------- Adding a value AFTER the corresponding property is set ---------------//
function addValue(obj) {
    $(obj).append("<div class='valueBox'><input id='wikidataApi' type='text' name='newValue'><input id='publish_statement_button' type='submit' value='✓ publish'><input id='cancel_statement_button' type='submit' value='X cancel'></div>");

    $(obj).find('#publish_statement_button').click(function () {
        console.log("Clicked the publish button!");
        var value = $(this).parents('.statementBox').find('input:text').val();
        var property = $(this).parents(".statementBox").find(".propertyBox").text();
        var valueBox = $(this).parents(".statementBox").find('.valueBox');
        valueBox.html(value);

        // find property by name: 		"name": "place of death",
        let propertyIndex = findWithAttribute(list_entity_edited, "name", property);
        if (propertyIndex >= 0) {
            list_entity_edited[propertyIndex].presence = true;
            let currentProperty = list_entity_edited[propertyIndex];
            console.log(list_entity_edited);
            var data = {
                workerID: localStorage.getItem("workerID"),
                hitID: localStorage.getItem("hitID"),
                assignmentID: localStorage.getItem("assignmentID"),
                condition: localStorage.getItem("condition"),
                relevance: currentProperty.relevance,
                timestamp: Date.now(),
                value: value,
                property: property,
                impactOnRelevance: impactOfEdits()
            };
            sendTrackingEvent(data, function (data) {
                    console.log("successfuly send things to the api: " + JSON.stringify(data));
                    $(obj).find(".propertyBox").removeClass("new");
                    //$("<div class='valueBox'>" + value + "</div>").insertBefore($(toolbarBox));
                    //$(newValue).remove();
                },
                function (response) {
                    console.log("Something went terribly wrong!");
                    console.log(response);
                });
        } else {
            console.log("Couldn't find property in list_entity edited:" + property);
        }
    });


    liveAutocompleteOptions = {
        minLength: 2,
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


function manageWikiAutocompletion(obj) {
    var tempJSON = [];
    var tempString = $(obj).attr("data-store");

    if (tempString != null) {
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

function callWikidataApi(e) {
    var autocompleteOptions = [];
    var liveInput = $(e).val();
    var url = 'https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&origin=*&search=' + liveInput;

    var xhr = createCORSRequest('GET', url);

    xhr.onload = function () {
        var responseText = JSON.parse(xhr.responseText);
        for (let key in responseText.search) {
            autocompleteOptions.push(responseText.search[key].label);
        }
        $(e).attr("data-store", autocompleteOptions);
    };

    xhr.send();
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
