var list_entity_original, list_entity_edited;

//Initialisierung von Recoin mit JSON von Properties
function recoinInit() {
    console.log("init");
    //TODO jquery.ajax (https://ikon-research.imp.fu-berlin.de/data/astronaut-stats.json)
    list_entity_original = JSON.parse($("#recoin-init").val());

    list_entity_edited = list_entity_original;
    console.log(list_entity_original);
    let completenessLevel = determine_completeness_level(list_entity_original);
    console.log("Found completenessLevel of " + completenessLevel);
}

//Aktuelles Completeness level
function determine_completeness_level(list_of_props) {
    var i = 0;
    var sumAbsences = 0;
    for (let currentProp of list_of_props) {
        //console.log(currentProp);
        //console.log(currentProp.presence == false);
        if (i >= 5) {
            break;
        }
        if (currentProp.presence == false) {
            sumAbsences = sumAbsences + currentProp.relevance;
            i++;
        }
    }
    return sumAbsences / 5;
}

//DOM manipulation
function recoinRender(condition) {
    var html = '<span id="rv1-Icon" style="display: inline-block;"><img src="./assets/1.png" title="This page provides basic information."></span>';
    switch (condition) {
        case 1:
            return
            break;
        case 2:
            $('#basicInfo').before(html);
            $('#languageBox').before(html);
            break;
        case 3:
            var icon = '';
            $('#languageBox').before(html);
            break;
        case 4:
            var icon = '';
            $('#languageBox').before(html);
            break;
        case 5:
            var icon = '';
            $('#languageBox').before(html);
            break;
        case 6:
            $('#languageBox').before(html);
    }
}


//Impact der Edits berechnen:
function impact_of_edits(list_entity_original, list_entity_edited) {
    return determine_completeness_level(list_entity_edited) - determine_completeness_level(list_entity_original);
}


//Benotung der Edits berechnen:
function grade_edits(list_entity_original, list_entity_edited) {
    var percentage_contribution = impact_of_edits(list_entity_original, list_entity_edited);
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
    //TODO autocomplete
    console.log("local autocomplete with:" + e.value);
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