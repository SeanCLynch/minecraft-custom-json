class WorldBuilder {
    constructor() {
        // Initialize class variables.
        this._dimensions = [];
        this._dimCount = 0;
        this._generateButton = document.querySelector("#generateBtn");
        this._addDimension = document.querySelector("#addDimension");

        // Set event handlers. 
        var self = this;
        this._generateButton.addEventListener("click", function(event){
            event.preventDefault();
            self.export();
        });
        this._addDimension.addEventListener("click", function(){
            self.addDimension(self._dimCount);
        });

        // Initialize with default 3 dimensions?
        
    }

    import() {
        // Build form from JSON object.
    }

    export() {
        // Build out JSON object from form. 
        let output = {};

        let bonus_chest = document.querySelector('#bonusChest').checked;
        output.bonus_chest = bonus_chest;

        let generate_features = document.querySelector('#generateFeatures').checked;
        output.generate_features = generate_features;

        let seed = document.querySelector('#seed').value;
        output.seed = seed;

        this._dimensions.forEach(dim => {
            var dimOutput = dim.export();
            output[dimOutput.name] = dimOutput;
        });

        let output_string = JSON.stringify(output, null, 4);
        document.querySelector('#JSONoutput').value = output_string;
    }

    addDimension() {
        // Create new dimension and add to dimension array (this._dimensions)
        let newDimension = new Dimension(this._dimCount);
        this._dimCount++;
        console.log(`Dimension added Succesfully. ${this._dimCount}`)
        this._dimensions.push(newDimension);
    }

    removeDimension() {
        // Remove dimension from Array
    }
    
}

class Dimension {
    constructor(idNum) {
        this._idNum = idNum;
        let dimensionTemplate = document.getElementById('dimensionTemplate').content.cloneNode(true);

        // Set a unique ID for new dimension.
        let dimension_holder = dimensionTemplate.querySelector('.dimension-holder');
        dimension_holder.setAttribute('id', `dim-${idNum}`);

        // Update summary sidebar.
        let summary_template = document.getElementById('sidebarRow').content.cloneNode(true);
        summary_template.querySelector('li').setAttribute('id', `summary-${idNum}`);
        summary_template.querySelector('h6').textContent = "New Dimension";
        document.getElementById('summary-sidebar').appendChild(summary_template);

         // Update summary header.
        let summary_header = document.getElementById('summary-header');
        summary_header.querySelector('.badge').textContent = idNum + 1;

        // dimName - Dimension Names
        dimensionTemplate.getElementById('dimName').addEventListener('input', function (event) {
            let sb_item = document.querySelector(`li#summary-${idNum} h6`);
            sb_item.textContent = event.target.value;
        });
        dimensionTemplate.getElementById('default-dim-names').addEventListener('change', function (event) {
            if (event.target.selectedIndex == 0) return;
            let new_name = event.target.options[event.target.selectedIndex].text;
            document.querySelector(`#dim-${idNum} input#dimName`).value = new_name;
            document.querySelector(`li#summary-${idNum} h6`).textContent = new_name;
        });

        // genType - Generator Type
        dimensionTemplate.getElementById('default-gen-types').addEventListener('change', function (event) {
            if (event.target.selectedIndex == 0) {
                document.querySelectorAll(`#dim-${idNum} .gen-type-option`).forEach(function (opt) {
                    opt.classList.remove('d-none');
                });
            } else {
                let new_name = event.target.options[event.target.selectedIndex].text;
                document.querySelector(`#dim-${idNum} input#genType`).value = new_name;
                document.querySelectorAll(`#dim-${idNum} .gen-type-option`).forEach(function (opt) {
                    opt.classList.add('d-none');
                });
            }
        });

        // fixedTime toggle 
        dimensionTemplate.getElementById('fixedTimeBool').addEventListener('change', function (event) {
            if (event.target.checked) {
                document.querySelector(`#dim-${idNum} input#fixedTime`).removeAttribute('disabled');
            } else {
                document.querySelector(`#dim-${idNum} input#fixedTime`).setAttribute('disabled', '');
            }
        });

        // Add new dimension form to world form.
        let worldForm = document.getElementById('worldForm');
        let endOfForm = document.getElementById('endOfForm');
        let insertedNode = worldForm.insertBefore(dimensionTemplate, endOfForm);
    }

    export() {

        var miniOutput = {};
        var elem = document.querySelector(`#dim-${this._idNum}`);

        let dim_name = elem.querySelector('#dimName').value;
        miniOutput["name"] = dim_name;

        let genType = elem.querySelector('#genType').value;
        miniOutput['generator'] = {
            "type": genType
        };

        let ultrawarmBool = elem.querySelector('#ultrawarm').checked;
        miniOutput['ultrawarm'] = ultrawarmBool;

        let naturalBool = elem.querySelector('#natural').checked;
        miniOutput['natural'] = naturalBool;

        let coorinateScaleFloat = elem.querySelector('#coordinateScale').value;
        miniOutput['coordinate_scale'] = Number(coorinateScaleFloat);

        let hasSkylightBool = elem.querySelector('#hasSkylight').checked;
        miniOutput['has_skylight'] = hasSkylightBool;

        let hasCeilingBool = elem.querySelector('#hasCeiling').checked;
        miniOutput['has_ceiling'] = hasCeilingBool;

        let ambientLightFloat = elem.querySelector('#ambientLight').value;
        miniOutput['ambient_light'] = Number(ambientLightFloat);

        let fixedTimeEnabled = elem.querySelector('#fixedTimeBool').checked;
        if (fixedTimeEnabled) {
            let fixedTime = elem.querySelector('#fixedTime').value;
            miniOutput['fixed_time'] = Number(fixedTime);
        }                    
    
        let piglinSafeBool = elem.querySelector('#piglinSafe').checked;
        miniOutput['piglin_safe'] = piglinSafeBool;
        
        let bedWorksBool = elem.querySelector('#bedWorks').checked;
        miniOutput['bed_works'] = bedWorksBool;

        let respawnAnchorWorksBool = elem.querySelector('#respawnAnchorWorks').checked;
        miniOutput['respawn_anchor_works'] = respawnAnchorWorksBool;

        console.log("I exported!")
        return miniOutput;
    }

}

document.addEventListener('DOMContentLoaded', function () {
    var wb = new WorldBuilder();
});

