class WorldBuilder {
    constructor() {
        // Initialize class variables.
        this._dimensions = [];
        this._dimCount = 0;
        this._generateButton = document.querySelector("#generateBtn");
        this._addDimension = document.querySelector("#addDimension");
        this._seedInput = document.querySelector('#seed');

        // Set event handlers. 
        var self = this;
        this._generateButton.addEventListener("click", function(event) {
            event.preventDefault();
            self.export();
        });
        this._addDimension.addEventListener("click", function() {
            self.addDimension();
        });
        this._seedInput.addEventListener('keyup', function(event) {
            var seed_sidebar = document.querySelector('#displaySeed');
            seed_sidebar.textContent = event.target.value;
        });

        // Initialize with default 3 dimensions.
        this.addDimension();
        this._dimensions[0].setDefaultOverworld();
        this.addDimension();
        this._dimensions[1].setDefaultNether();
        this.addDimension();
        this._dimensions[2].setDefaultEnd();
    }

    import() {
        // Build form from JSON object.
    }

    export() {
        // Build out JSON object from form. 
        let output = {};
        console.log("Exporting World...");

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
        // Create new dimension and add to dimension array (this._dimensions).
        let newDimension = new Dimension(this._dimCount++, this);
        this._dimensions.push(newDimension);
    }

    removeDimension(idNum) {
        // Remove dimension from Array
        console.log(`Removing dimension id=${idNum}`);
        var reduced_dimensions = this._dimensions.filter(dim => {
            if (dim._idNum != idNum) return dim;
        });
        this._dimensions = reduced_dimensions;
    }
    
}

class Dimension {
    constructor(idNum, wb) {
        this._wb = wb;
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
        let summary_header = document.getElementById('summary-header');
        summary_header.querySelector('.badge').textContent = idNum + 1;

        // Set event listeners within the dimension ------------------------------------------------
        var self = this;

        // Changing dimension name updates sidebar & display title.
        dimensionTemplate.getElementById('dimName').addEventListener('input', function (event) {
            let sb_item = document.querySelector(`li#summary-${idNum} h6`);
            sb_item.textContent = event.target.value;
            let dim_title = document.querySelector(`#dim-${idNum} #displayName`);
            dim_title.textContent = event.target.value;
        });

        // Selecting pre-set dimension name updates sidebar & input field. 
        dimensionTemplate.getElementById('default-dim-names').addEventListener('change', function (event) {
            if (event.target.selectedIndex == 0) return;
            let new_name = event.target.options[event.target.selectedIndex].text;
            document.querySelector(`#dim-${idNum} input#dimName`).value = new_name;
            document.querySelector(`li#summary-${idNum} h6`).textContent = new_name;
            document.querySelector(`#dim-${idNum} #displayName`).textContent = new_name;
        });

        // Selecting pre-set generator types toggles options. 
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

        // Toggle button for fixedTime generator option. 
        dimensionTemplate.getElementById('fixedTimeBool').addEventListener('change', function (event) {
            if (event.target.checked) {
                document.querySelector(`#dim-${idNum} input#fixedTime`).removeAttribute('disabled');
            } else {
                document.querySelector(`#dim-${idNum} input#fixedTime`).setAttribute('disabled', '');
            }
        });

        // Remove this dimension. 
        dimensionTemplate.getElementById('deleteDimensionBtn').addEventListener('click', function (event) {
            event.preventDefault();

            // Remove dimension for WorldBuilder class.
            self._wb.removeDimension(idNum);

            // Remove dimension from form. 
            let whole_dimension = document.querySelector(`#dim-${idNum}`);
            let dim_hr_tag = whole_dimension.previousElementSibling;
            whole_dimension.parentElement.removeChild(dim_hr_tag);
            whole_dimension.parentElement.removeChild(whole_dimension);

            // Remove dimension from sidebar.
            let dim_sidebar = document.querySelector(`#summary-${idNum}`);
            dim_sidebar.parentElement.removeChild(dim_sidebar);
        });

        // Add new dimension form to world form.
        let worldForm = document.getElementById('worldForm');
        let endOfForm = document.getElementById('endOfForm');
        let insertedNode = worldForm.insertBefore(dimensionTemplate, endOfForm);
    }

    export() {
        console.log(`Exporting dimension id=${this._idNum}`);

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

        return miniOutput;
    }

    setDefaultOverworld() {
        console.log(`setting dimension ${this._idNum} to overworld`);
        var currDim = document.querySelector(`#dim-${this._idNum}`);

        // Update titles
        document.querySelector(`li#summary-${this._idNum} h6`).textContent = "minecraft:overworld";
        document.querySelector(`#dim-${this._idNum} #displayName`).textContent = "minecraft:overworld";
    }

    setDefaultNether() {
        console.log(`setting dimension ${this._idNum} to nether`);
        var currDim = document.querySelector(`#dim-${this._idNum}`);

        // Update titles
        document.querySelector(`li#summary-${this._idNum} h6`).textContent = "minecraft:the_nether";
        document.querySelector(`#dim-${this._idNum} #displayName`).textContent = "minecraft:the_nether";

        // Update dimension name.
        document.querySelector(`#dim-${this._idNum} #dimName`).value = "minecraft:the_nether";
        document.querySelector(`#dim-${this._idNum} #default-dim-names`).selectedIndex = 2;
    }

    setDefaultEnd() {
        console.log(`setting dimension ${this._idNum} to end`);
        var currDim = document.querySelector(`#dim-${this._idNum}`);

        // Update titles
        document.querySelector(`li#summary-${this._idNum} h6`).textContent = "minecraft:the_end";
        document.querySelector(`#dim-${this._idNum} #displayName`).textContent = "minecraft:the_end";

        // Update dimension name.
        document.querySelector(`#dim-${this._idNum} #dimName`).value = "minecraft:the_end";
        document.querySelector(`#dim-${this._idNum} #default-dim-names`).selectedIndex = 3;
    }

}

document.addEventListener('DOMContentLoaded', function () {
    var wb = new WorldBuilder();
});

