var dimension_count = 0;

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#addDimension').addEventListener('click', function (event) {
        try {
            let dimensionTemplate = document.getElementById('dimensionTemplate').content.cloneNode(true);
            let dimension_num = dimension_count;
            dimension_count++;

            // Set a unique ID for new dimension.
            let dimension_holder = dimensionTemplate.querySelector('.dimension-holder');
            dimension_holder.setAttribute('id', `dim-${dimension_num}`);

            // Update summary sidebar.
            let summary_template = document.getElementById('sidebarRow').content.cloneNode(true);
            summary_template.querySelector('li').setAttribute('id', `summary-${dimension_num}`);
            summary_template.querySelector('h6').textContent = "New Dimension";
            document.getElementById('summary-sidebar').appendChild(summary_template);

            // Update summary header.
            let summary_header = document.getElementById('summary-header');
            summary_header.querySelector('.badge').textContent = dimension_num + 1;

            // Add event handlers for new form. 



            // dimName - Dimension Names
            dimensionTemplate.getElementById('dimName').addEventListener('input', function (event) {
                let sb_item = document.querySelector(`li#summary-${dimension_num} h6`);
                sb_item.textContent = event.target.value;
            });
            dimensionTemplate.getElementById('default-dim-names').addEventListener('change', function (event) {
                if (event.target.selectedIndex == 0) return;
                let new_name = event.target.options[event.target.selectedIndex].text;
                document.querySelector(`#dim-${dimension_num} input#dimName`).value = new_name;
                document.querySelector(`li#summary-${dimension_num} h6`).textContent = new_name;
            });

            // genType - Generator Type
            dimensionTemplate.getElementById('default-gen-types').addEventListener('change', function (event) {
                if (event.target.selectedIndex == 0) {
                    document.querySelectorAll(`#dim-${dimension_num} .gen-type-option`).forEach(function (opt) {
                        opt.classList.remove('d-none');
                    });
                } else {
                    let new_name = event.target.options[event.target.selectedIndex].text;
                    document.querySelector(`#dim-${dimension_num} input#genType`).value = new_name;
                    document.querySelectorAll(`#dim-${dimension_num} .gen-type-option`).forEach(function (opt) {
                        opt.classList.add('d-none');
                    });
                }
            });

            // fixedTime toggle 
            dimensionTemplate.getElementById('fixedTimeBool').addEventListener('change', function (event) {
                if (event.target.checked) {
                    document.querySelector(`#dim-${dimension_num} input#fixedTime`).removeAttribute('disabled');
                } else {
                    document.querySelector(`#dim-${dimension_num} input#fixedTime`).setAttribute('disabled', '');
                }
            });

            // Add new dimension form to world form.
            let worldForm = document.getElementById('worldForm');
            let endOfForm = document.getElementById('endOfForm');
            let insertedNode = worldForm.insertBefore(dimensionTemplate, endOfForm);

        } catch (e) {
            console.log(e);
        }
    });

    // Event Listener for Generating
    document.querySelector('#generateBtn').addEventListener('click', function (event) {
        event.preventDefault();

        let output = {};

        let bonus_chest = document.querySelector('#bonusChest').checked;
        output.bonus_chest = bonus_chest;

        let generate_features = document.querySelector('#generateFeatures').checked;
        output.generate_features = generate_features;

        let seed = document.querySelector('#seed').value;
        output.seed = seed;


        output.dimensions = {};
        // Handler for each dimension 
        document.querySelectorAll('.dimension-holder').forEach(function (elem, idx) {
            let dim_name = elem.querySelector('#dimName').value;

            let genType = elem.querySelector('#genType').value;
            output.dimensions[dim_name]['generator'] = {
                "type": genType
            };

            let ultrawarmBool = elem.querySelector('#ultrawarm').checked;
            output.dimensions[dim_name]['ultrawarm'] = ultrawarmBool;

            let naturalBool = elem.querySelector('#natural').checked;
            output.dimensions[dim_name]['natural'] = naturalBool;

            let coorinateScaleFloat = elem.querySelector('#coordinateScale').value;
            output.dimensions[dim_name]['coordinate_scale'] = Number(coorinateScaleFloat);

            let hasSkylightBool = elem.querySelector('#hasSkylight').checked;
            output.dimensions[dim_name]['has_skylight'] = hasSkylightBool;

            let hasCeilingBool = elem.querySelector('#hasCeiling').checked;
            output.dimensions[dim_name]['has_ceiling'] = hasCeilingBool;

            let ambientLightFloat = elem.querySelector('#ambientLight').value;
            output.dimensions[dim_name]['ambient_light'] = Number(ambientLightFloat);

            let fixedTimeEnabled = document.querySelector('#fixedTimeBool').checked;
            if (fixedTimeEnabled) {
                let fixedTime = elem.querySelector('#fixedTime').value;
                output.dimensions[dim_name]['fixed_time'] = Number(fixedTime);
            }                    
        
            let piglinSafeBool = elem.querySelector('#piglinSafe').checked;
            output.dimensions[dim_name]['piglin_safe'] = piglinSafeBool;
            
            let bedWorksBool = elem.querySelector('#bedWorks').checked;
            output.dimensions[dim_name]['bed_works'] = bedWorksBool;

            let respawnAnchorWorksBool = elem.querySelector('#respawnAnchorWorks').checked;
            output.dimensions[dim_name]['respawn_anchor_works'] = respawnAnchorWorksBool;
            
        });
    

        let output_string = JSON.stringify(output, null, 4);
        document.querySelector('#JSONoutput').value = output_string;
    });

    var setupDefaultWorld = function () {
        // First, we add 3 dimensions. 
        let addDimBtn = document.querySelector('#addDimension');
        addDimBtn.click();

        addDimBtn.click();
        document.querySelector('#dim-1 input#dimName').value = "minecraft:the_nether";
        document.querySelector('#dim-1 select#default-dim-names').selectedIndex = 2;

        addDimBtn.click();
        document.querySelector('#dim-2 input#dimName').value = "minecraft:the_end";
        document.querySelector('#dim-2 select#default-dim-names').selectedIndex = 3;

    };

    setupDefaultWorld();
});
