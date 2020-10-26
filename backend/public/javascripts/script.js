import { URI } from '/javascripts/modules/api-uri.mjs';

document.body.onload = script;


function script() {
    page.main();
}


const page = {
    main: () => {
        render.mainNav();
        addEventHandlersTo.mainNav();
    },
    piecesNav: () => {
        render.piecesNav();
        addEventHandlersTo.piecesNav();
    },
    leasingNav: () => {
        render.leasingNav();
    },
    findPiece: async () => {
        render.pageIsBusy();
        await data.getDbData();
        if (data.allDbDataFetched()) {
            render.findPiecePage();
            addEventHandlersTo.findPiecePage();
        }
    },
    piecesFound: async () => {
        render.piecesFound();
    },
    addPiece: async () => {
        render.pageIsBusy();
        await data.getDbData();
        if (data.allDbDataFetched()) {
            render.addPiecePage();
            addEventHandlersTo.addPiecePage();
            const brandsArray = functions.getStringArrayFromObjectsProperty(data.brands, "name");
            const categoriesArray = functions.getStringArrayFromObjectsProperty(data.categories, "name");
            const stylesArray = functions.getStringArrayFromObjectsProperty(data.styles, "name");
            const materialsArray = functions.getStringArrayFromObjectsProperty(data.materials, "name");
            const colorsArray = functions.getStringArrayFromObjectsProperty(data.colors, "name");

            console.log("arraya", categoriesArray, stylesArray, materialsArray, colorsArray);
            UI.createAutoComplete(document.getElementById("add-form-brand"), brandsArray);
            UI.createAutoComplete(document.getElementById("add-form-category"), categoriesArray);
            UI.createAutoComplete(document.getElementById("add-form-style"), stylesArray);
            UI.createAutoComplete(document.getElementById("add-form-material"), materialsArray);
            UI.createAutoComplete(document.getElementById("add-form-color"), colorsArray);

        }
    },
    previewModal: (values) => {
        render.previewNewPieceModal(values);
        data.currentPreviewModal = values;
        addEventHandlersTo.previewModal();
    },
    unloadPreviewModal: () => {
        document.getElementById("preview-piece-modal-backdrop").remove();
    },
    alert: (header, text, obj) => {
        render.alert(header, text, obj);
        addEventHandlersTo.alert();
    }
}



const render = {
    pageIsBusy: () => {
        document.getElementById("page-content").innerHTML = `
        <div id="spinner-container">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        `
    },
    siteIsBusy: () => {
        document.getElementById("page-content").innerHTML += `
        <div id="site-is-busy-container">
            <div id="spinner-container">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        <div id="site-is-busy-container">
        `
    },
    siteIsNotBusy: () => {
        document.getElementById("site-is-busy-container").remove();
    },
    mainNav: () => {
        document.getElementById("app").innerHTML = `
        <nav id="mainNav" class="navbar navbar-expand-lg navbar-light bg-light">
            <a id="homeBtn" class="navbar-brand" href="#">Cube Admin</a>
            <ul class="navbar-nav">
                <li class="nav-item">
                <a class="nav-link" id="piecesBtn" href="#">${language[pageSettings.language].nav.pieces}<span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                <a class="nav-link" id="leasingBtn" href="#">${language[pageSettings.language].nav.leasing}</a>
                </li>
            </ul>
        </nav>
        <div id ="secondaryNavContainer">
        </div>
        <div id="page-content"></div>
    `
    },
    piecesNav: () => {
        document.getElementById("secondaryNavContainer").innerHTML = `
        <nav id="secondaryNav" class="navbar navbar-expand-lg navbar-light bg-light">
            <ul class="navbar-nav">
                <li class="nav-item">
                <a class="nav-link" id="findPieceBtn" href="#">${language[pageSettings.language].secNav.findPiece}<span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                <a class="nav-link" id="addPieceBtn" href="#">${language[pageSettings.language].secNav.addPiece}</a>
                </li>
            </ul>
        </nav>
        `
    },
    leasingNav: () => {
        document.getElementById("secondaryNavContainer").innerHTML = `
        <nav id="secondaryNav" class="navbar navbar-expand-lg navbar-light bg-light">
            <ul class="navbar-nav">
                <li class="nav-item">
                <a class="nav-link" id="searchPieceBtn" href="#">${language[pageSettings.language].secNav.newLease}<span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                <a class="nav-link" id="addPieceBtn" href="#">${language[pageSettings.language].secNav.findLease}</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" id="addPieceBtn" href="#">${language[pageSettings.language].secNav.ongoingLeases}</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" id="addPieceBtn" href="#">${language[pageSettings.language].secNav.calendar}</a>
                </li>
            </ul>
        </nav>
        `
    },
    findPiecePage: () => {
        document.getElementById("page-content").innerHTML = `
        <h3 class="page-header">${language[pageSettings.language].findPiecePage.header}</h3>
            <form class="id-form">
                <div class="form-group">
                    <label for="search-form-id">ID</label>
                    <div id="id-container">
                        <input maxlength="24" type="string" class="form-control" id="search-form-id" placeholder="5f9093819c3ea25344d02e3d
                        "/>
                        <div id="id-input-accessories">
                            <p id="confirm-id-text"></p>
                        </div>
                    </div>
                </div>
            </form>
            <hr>
            <form class="attributes-form">
                <div class="input-group">
                    <select name="category" class="select-search" id="search-form-category">
                    <option id="null">${language[pageSettings.language].findPiecePage.category}</option>
                    ${data.categories.map(c => {
            return (
                `<option id=${c._id}>${c.name}</option>`
            )
        })}
                    </select>
                    <select name="style" class="select-search" id="search-form-style">
                    <option id="null">${language[pageSettings.language].findPiecePage.style}</option>
                    ${data.styles.map(m => {
            return (
                `<option id=${m._id}>${m.name}</option>`
            )
        })}
                    </select>
                    <select name="material" class="select-search" id="search-form-material">
                    <option id="null">${language[pageSettings.language].findPiecePage.material}</option>
                    ${data.materials.map(m => {
            return (
                `<option id=${m._id}>${m.name}</option>`
            )
        })}
                    </select>
                    <select name="color" class="select-search" id="search-form-color">
                    <option id="null">${language[pageSettings.language].findPiecePage.color}</option>
                    ${data.colors.map(m => {
            return (
                `<option id=${m._id}>${m.name}</option>`
            )
        })}
                    </select>
                    <select name="brand" class="select-search" id="search-form-brand">
                    <option id="null">${language[pageSettings.language].findPiecePage.brand}</option>
                    ${data.brands.map(m => {
            return (
                `<option id=${m._id}>${m.name}</option>`
            )
        })}
                    </select>
                </div>
            </form>
            <br>
            <br>
            <div id="pieces-found-container"></div>
        `
    },
    piecesFound: () => {
        if (data.piecesFound.length < 1) {
            document.getElementById("pieces-found-container").innerHTML = "";
        } else {
            document.getElementById("pieces-found-container").innerHTML = `
        ${data.piecesFound.map(p => {
                return (`<div class="card" style="width: 18rem;">
            <img src="https://picsum.photos/286/286?grayscale" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">${p.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${data.categories.find(c => c._id === p.category).name}</h6>
                <h6 class="card-subtitle mb-2 text-muted">${data.styles.find(c => c._id === p.style).name}</h6>
                <h6 class="card-subtitle mb-2 text-muted">${data.materials.find(c => c._id === p.material).name}</h6>
                <h6 class="card-subtitle mb-2 text-muted">${data.brands.find(c => c._id === p.brand).name}</h6>
                <p class="card-text">${p.description}</p>
                </div>
            </div>`)
            })}
        `}
    },
    addPiecePage: () => {
        document.getElementById("page-content").innerHTML = `
        <h3 class="page-header">${language[pageSettings.language].addPiecePage.header}</h3>
            <br>
                <form class="add-piece-form" autocomplete="off">
                <div class="form-group">
                    <label for="add-form-name">${language[pageSettings.language].addPiecePage.name}</label>
                    <input value="Name" type="text" class="form-control" id="add-form-name" name="name" placeholder="${language[pageSettings.language].addPiecePage.nameInputPlaceholder}">
                </div>
                <div class="form-group">
                    <label for="add-form-description">${language[pageSettings.language].addPiecePage.description}</label>
                    <textarea maxlength="150" style="height: 65px; resize: none;" name="description" class="form-control" id="add-form-description" placeholder="${language[pageSettings.language].addPiecePage.descriptionInputPlaceholder}">Description</textarea>
                </div>
              
                <div class="autocomplete">
                    <label for="add-form-brand">${language[pageSettings.language].addPiecePage.brand}</label>
                    <input value="Brand" class="form-control" class="form-control" id="add-form-brand" type="text" name="brand" db="brands" placeholder="${language[pageSettings.language].addPiecePage.brandInputPlaceholder}" />
                </div>
                <div class="autocomplete">
                    <label for="add-form-category">${language[pageSettings.language].addPiecePage.category}</label>
                    <input value="Category" class="form-control" class="form-control" id="add-form-category" type="text" name="category" db="categories" placeholder="${language[pageSettings.language].addPiecePage.categoryInputPlaceholder}" />
                </div>
                <div class="autocomplete">
                    <label for="add-form-style">${language[pageSettings.language].addPiecePage.style}</label>
                    <input value="Style" class="form-control" id="add-form-style" type="text" name="style" db="styles" placeholder="${language[pageSettings.language].addPiecePage.styleInputPlaceholder}" />
                </div>
                <div class="autocomplete">
                    <label for="add-form-material">${language[pageSettings.language].addPiecePage.material}</label>
                    <input value="Material" class="form-control" id="add-form-material" type="text" name="material" db="materials" placeholder="${language[pageSettings.language].addPiecePage.materialInputPlaceholder}" />
                </div>
                <div class="autocomplete">
                    <label for="add-form-color">${language[pageSettings.language].addPiecePage.color}</label>
                    <input value="Color" class="form-control" id="add-form-color" type="text" name="color" db="colors" placeholder="${language[pageSettings.language].addPiecePage.colorInputPlaceholder}" />
                </div>
                <button id="add-form-submit" type="submit" class="btn btn-primary">${language[pageSettings.language].addPiecePage.addBtn}</button>
            </form>
        `
    },
    previewNewPieceModal: (piece) => {
        document.getElementById("app").innerHTML += `
        <div id="preview-piece-modal-backdrop">
            <div id="preview-piece-modal" class="card" style="width: 18rem;">
                <img src="https://picsum.photos/286/286?grayscale" class="card-img-top" alt="...">
                <div id="preview-piece-card" class="card-body">
                    <h5 class="card-title">${piece.name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${piece.category.name}</h6>
                    <h6 class="card-subtitle mb-2 text-muted">${piece.style.name}</h6>
                    <h6 class="card-subtitle mb-2 text-muted">${piece.material.name}</h6>
                    <h6 class="card-subtitle mb-2 text-muted">${piece.brand.name}</h6>
                    <p class="card-text">${piece.description}</p>
                </div>
            </div>
            <div id="card-buttons">
                <button class="btn btn-success" id="save-preview-piece-btn">${language[pageSettings.language].piecePreviewModal.saveBtn}
                <button class="btn btn-danger" id="cancel-preview-piece-btn">${language[pageSettings.language].piecePreviewModal.cancelBtn}
            </div>
        </div>`
    },
    alert: (header, text, obj) => {
        document.getElementById("app").innerHTML += `
        <div id="alert-container">
            <div id="alert" class="alert alert-danger" role="alert">
                <h4 class="alert-heading">${header}</h4>
                <p>${text}</p>
                <hr>
                ${Object.keys(obj).map(k => {
            return `<button id="new-attr-btn" type="button" class="btn btn-light">${obj[k].name}</button>`
        }).join("")}
                <br>
                <br>
                <div id="alert-btn-container">
                    <button class="alert-btn btn btn-success" id="ok-alert-btn">${language[pageSettings.language].alert.okBtn}
                    <button class="alert-btn btn btn-danger" id="modify-alert-btn">${language[pageSettings.language].alert.abortBtn}
                </div>
            </div>
        </div>
        `
    }


}

const UI = {
    unfocusForm: formName => {
        document.getElementsByClassName(formName)[0].setAttribute("id", "unfocus");
    },
    focusForm: formName => {
        if (document.getElementsByClassName(formName)[0].getAttribute("id") !== null) {
            document.getElementsByClassName(formName)[0].removeAttribute("id");
        }
    },
    idSearchSuccess: () => {
        UI.removeSpinnerForIdInput();
        document.getElementById("search-form-id").style.backgroundColor = "#ABFF73";
    },
    removeIdSearchSuccess: () => {
        document.getElementById("search-form-id").style.backgroundColor = "white";
    },
    spinnerForIdInput: () => {
        document.getElementById("id-input-accessories").innerHTML += `
        <div id="id-spinner" class="spinner-grow spinner-grow-sm" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    `
    },
    removeSpinnerForIdInput: () => {
        if (document.getElementById("id-spinner")) {
            document.getElementById("id-spinner").remove();
        }
    },
    createAutoComplete: (searchEle, arr) => {
        var currentFocus;
        searchEle.addEventListener("input", function (e) {
            console.log("goooo");
            var divCreate,
                b,
                i,
                fieldVal = this.value;
            closeAllLists();
            if (!fieldVal) {
                return false;
            }
            currentFocus = -1;
            divCreate = document.createElement("DIV");
            divCreate.setAttribute("id", this.id + "autocomplete-list");
            divCreate.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(divCreate);
            for (i = 0; i < arr.length; i++) {
                if (arr[i].substr(0, fieldVal.length).toUpperCase() == fieldVal.toUpperCase()) {
                    b = document.createElement("DIV");
                    b.innerHTML = "<strong>" + arr[i].substr(0, fieldVal.length) + "</strong>";
                    b.innerHTML += arr[i].substr(fieldVal.length);
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    b.addEventListener("click", function (e) {
                        searchEle.value = this.getElementsByTagName("input")[0].value;
                        closeAllLists();
                    });
                    divCreate.appendChild(b);
                }
            }
        });
        searchEle.addEventListener("keydown", function (e) {
            var autocompleteList = document.getElementById(
                this.id + "autocomplete-list"
            );
            if (autocompleteList)
                autocompleteList = autocompleteList.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(autocompleteList);
            }
            else if (e.keyCode == 38) {
                //up
                currentFocus--;
                addActive(autocompleteList);
            }
            else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (autocompleteList) autocompleteList[currentFocus].click();
                }
            }
        });
        function addActive(autocompleteList) {
            if (!autocompleteList) return false;
            removeActive(autocompleteList);
            if (currentFocus >= autocompleteList.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = autocompleteList.length - 1;
            autocompleteList[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(autocompleteList) {
            for (var i = 0; i < autocompleteList.length; i++) {
                autocompleteList[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            var autocompleteList = document.getElementsByClassName(
                "autocomplete-items"
            );
            for (var i = 0; i < autocompleteList.length; i++) {
                if (elmnt != autocompleteList[i] && elmnt != searchEle) {
                    autocompleteList[i].parentNode.removeChild(autocompleteList[i]);
                }
            }
        }
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    },
}

const addEventHandlersTo = {
    mainNav: () => {
        document.getElementById("piecesBtn").addEventListener("click", eventHandlers.onPiecesBtnClicked);
        document.getElementById("leasingBtn").addEventListener("click", eventHandlers.onLeasingBtnClicked);
        document.getElementById("homeBtn").addEventListener("click", eventHandlers.onHomeBtnClicked);
    },
    piecesNav: () => {
        document.getElementById("findPieceBtn").addEventListener("click", eventHandlers.onFindPieceBtnClicked);
        document.getElementById("addPieceBtn").addEventListener("click", eventHandlers.onAddPieceBtnClicked);
    },
    findPiecePage: () => {
        document.getElementById("search-form-id").addEventListener("keyup", e => eventHandlers.onIdChange(e))
        document.getElementsByClassName("id-form")[0].addEventListener("click", eventHandlers.onFocusIdForm);
        document.getElementsByClassName("attributes-form")[0].addEventListener("click", eventHandlers.onFocusAttributesForm);
        document.getElementsByClassName("attributes-form")[0].addEventListener("change", e => eventHandlers.onChangeAttributesForm(e));
    },
    addPiecePage: () => {
        document.getElementById("add-form-submit").addEventListener("click", e => eventHandlers.onSubmitAddFormClickedEventHandler(e));
    },
    previewModal: () => {
        document.getElementById("save-preview-piece-btn").addEventListener("click", eventHandlers.onSavePreviewPieceBtnClicked)
    },
    alert: () => {
        document.getElementById("ok-alert-btn").addEventListener("click", eventHandlers.onOkAlertBtnClicked);
        document.getElementById("modify-alert-btn").addEventListener("click", eventHandlers.onModifyAlertBtnClicked);
    }
}

const eventHandlers = {
    onPiecesBtnClicked: () => {

        page.piecesNav();
    },
    onLeasingBtnClicked: () => {
        page.leasingNav();
    },
    onHomeBtnClicked: () => {
        page.main();
    },
    onFindPieceBtnClicked: () => {
        page.findPiece();
    },
    onAddPieceBtnClicked: () => {
        page.addPiece();
    },
    onIdChange: async e => {
        const numchar = e.target.value.split("").length;
        document.getElementById("confirm-id-text").innerText = functions.getIdInputCharLeft(e);
        if (numchar < 24) {
            flag.searchPieceSuccess = false;
            UI.removeSpinnerForIdInput();
            UI.removeIdSearchSuccess();
            data.piecesFound = [];
            page.piecesFound();
        }
        if (numchar === 24 && !flag.searchPieceSuccess) {
            UI.spinnerForIdInput();
            const piece = await data.getPieceFromId(e.target.value);
            if (Object.keys(piece.data).length > 0) {
                flag.searchPieceSuccess = true;
                UI.idSearchSuccess();
                data.piecesFound = [{ ...piece.data }];
                console.log(data.piecesFound);
                page.piecesFound();
            }
        }
    },
    onFocusIdForm: () => {
        UI.unfocusForm("attributes-form");
        UI.focusForm("id-form");
        flag.searchWithId = true;
        flag.searchWithAttributes = false;
    },
    onFocusAttributesForm: () => {
        UI.unfocusForm("id-form");;
        UI.focusForm("attributes-form");
        flag.searchWithId = false;
        flag.searchWithAttributes = true;
    },
    onChangeAttributesForm: async (e) => {
        console.log(e.target);
        const { category, style, material, color, brand } = functions.getAllIdsFromSearchForm(e.target.parentNode);
        console.log("category", category, "style", style, "material", material, "color", color, "brand", brand);
        if (category !== "null" || style !== "null" || material !== "null" || color !== "null" || brand !== "null") {
            const pieces = await data.getPiecesFromAttributeIds(category.id, style.id, material.id, color.id, brand.id);
            data.piecesFound = [...pieces.data];
        } else {
            data.piecesFound = [];
        }
        console.log(data.piecesFound);
        page.piecesFound();
    },
    onSubmitAddFormClickedEventHandler: e => {
        e.preventDefault();
        const form = e.target.parentNode;
        try {
            functions.lockAllInputsOnAddForm(form);
            render.siteIsBusy();
            const nameValues = functions.getAllNamesFromAddForm(form);
            const fullValues = functions.getAllDbIdsOfSelectedAttributes(nameValues);
            page.previewModal(fullValues);
        }
        finally {
            render.siteIsNotBusy();
        }
    },
    onSavePreviewPieceBtnClicked: () => {
        data.newAttributes = functions.findNewAttributesInPreviewModal();
        if (data.newAttributes) {
            page.unloadPreviewModal();
            page.alert(language[pageSettings.language].alert.newAttHeader, language[pageSettings.language].alert.newAttText, data.newAttributes);
        }
    },
    onOkAlertBtnClicked: async () => {
        console.log("ok button clicked");
        try {
            console.log("try")
            render.siteIsBusy();
            await data.addNewAttributesToDb();
        }
        catch {

        }
        finally {
            render.siteIsNotBusy();
        }

    }
}

const data = {
    piecesFound: [],
    categories: [],
    styles: [],
    materials: [],
    colors: [],
    brands: [],
    currentPreviewModal: {},
    newAttributes: {},
    allDbDataFetched: () => {
        return (flag.categoriesFetched && flag.stylesFetched && flag.materialsFetched && flag.colorsFetched && flag.brandsFetched)
    },
    getCategories: async () => {
        try {
            return await axios.get(URI.categories.get);
        } catch (error) {
            console.error(error)
        }
    },
    getMaterials: async () => {
        try {
            return await axios.get(URI.materials.get);
        } catch (error) {
            console.error(error)
        }
    },
    getStyles: async () => {
        try {
            return await axios.get(URI.styles.get);
        } catch (error) {
            console.error(error)
        }
    },
    getColors: async () => {
        try {
            return await axios.get(URI.colors.get);
        } catch (error) {
            console.error(error)
        }
    },
    getBrands: async () => {
        try {
            return await axios.get(URI.brands.get);
        } catch (error) {
            console.error(error)
        }
    },
    getPieceFromId: async (id) => {
        try {
            return await axios.get(URI.pieces.get + id);
        } catch (error) {
            console.error(error)
        }
    },
    getPiecesFromAttributeIds: async (category, style, material, color, brand) => {
        try {
            return await axios.get(URI.pieces.get + category + "/" + style + "/" + material + "/" + color + "/" + brand);
        } catch (error) {
            console.error(error)
        }
    },
    getDbData: async () => {
        try {
            if (!flag.categoriesFetched) {
                const categories = await data.getCategories();
                data.categories = categories.data;
                console.log(categories.data);
                flag.categoriesFetched = true;
            }
            if (!flag.materialsFetched) {
                const materials = await data.getMaterials();
                data.materials = materials.data;
                console.log(materials.data);
                flag.materialsFetched = true;
            }
            if (!flag.stylesFetched) {
                const styles = await data.getStyles();
                data.styles = styles.data;
                console.log(styles.data);
                flag.stylesFetched = true;
            }
            if (!flag.colorsFetched) {
                const colors = await data.getColors();
                data.colors = colors.data;
                console.log(colors.data);
                flag.colorsFetched = true;
            }
            if (!flag.brandsFetched) {
                const brands = await data.getBrands();
                data.brands = brands.data;
                console.log(brands.data);
                flag.brandsFetched = true;
            }
        } catch (error) {
            console.log(error);
        }
    },
    addNewAttributesToDb: async () => {
        if (data.newAttributes.category) {
            await axios.post(URI.categories.post, { "name": `${data.newAttributes.category.name}` })
                .then(res => console.log(res))
                .catch
                (err => console.log(err))
        }
        if (data.newAttributes.style) {
            await axios.post(URI.styles.post, { "name": `${data.newAttributes.style.name}` })
                .then(res => console.log(res))
                .catch
                (err => console.log(err))
        }
        if (data.newAttributes.material) {
            await axios.post(URI.materials.post, { "name": `${data.newAttributes.material.name}` })
                .then(res => console.log(res))
                .catch
                (err => console.log(err))
        }
        if (data.newAttributes.color) {
            await axios.post(URI.colors.post, { "name": `${data.newAttributes.color.name}` })
                .then(res => console.log(res))
                .catch
                (err => console.log(err))
        }
        if (data.newAttributes.brand) {
            await axios.post(URI.brands.post, { "name": `${data.newAttributes.brand.name}` })
                .then(res => console.log(res))
                .catch
                (err => console.log(err))
        }
    }
}

const functions = {
    getIdInputCharLeft: (e) => {
        const realPass = "5f9093819c3ea25344d02e3d";
        console.log("pass length max", realPass.split("").length)
        const exes = (() => {
            let x = "";
            e.target.value.split("").forEach(c => {
                x += "X"
            });
            return x;
        })();
        console.log("exes", exes);
        const os = (() => {
            let o = "";
            let no = realPass.split("").length - exes.split("").length;
            for (let index = 0; index < no; index++) {
                o += "O"

            }
            return o;
        })();
        return exes + os;
    },
    getAllIdsFromSearchForm: form => {
        console.log("form", form);
        console.log("form children", form.children);
        const HTMLobj = form.children;
        const obj = {};
        Object.keys(HTMLobj).forEach(k => {
            console.log("key", k, HTMLobj[k].name, HTMLobj[k].options[HTMLobj[k].selectedIndex].id);
            obj[`${HTMLobj[k].name}`] = {};
            obj[`${HTMLobj[k].name}`] = { id: `${HTMLobj[k].options[HTMLobj[k].selectedIndex].id}`, name: `${HTMLobj[k].options[HTMLobj[k].selectedIndex].value}` };
        });
        console.log("obj", obj);
        return obj;
    },
    getAllNamesFromAddForm: form => {
        console.log("form", form);
        var attributes = {};
        for (var i = 0; i < 7; i++) {
            var e = form.children[i].children[1];
            const s = e.value;
            console.log(s);
            attributes[`${e.name}`] = {};
            attributes[`${e.name}`] = e.value;

        }
        return attributes;
    },
    lockAllInputsOnAddForm: form => {
        console.log("form", form);
        var attributes = {};
        for (var i = 0; i < 7; i++) {
            var e = form.children[i].children[1];
            e.setAttribute("disabled", "true");

        }
        var e = form.children[7];
        e.setAttribute("disabled", "true");
    },
    getStringArrayFromObjectsProperty: (obj, prop) => {
        return Object.keys(obj).map(k => {
            return obj[k][prop];
        });
    },
    getAllDbIdsOfSelectedAttributes: obj => {
        let updObj = {};
        console.log("updobj", updObj);
        console.log("data", data.categories);

        Object.keys(obj).forEach(k => {
            switch (k) {
                case "name": {
                    updObj.name = obj[k];
                    break;
                }
                case "description": {
                    updObj.description = obj[k];
                    break;
                }
                case "category": {
                    const val = data.categories.find(c => c.name === obj[k]);
                    console.log("found", val, obj[k]);
                    updObj.category = {};
                    if (val) {
                        updObj.category._id = val._id;
                    } else {
                        updObj.category._id = "new";
                    }
                    updObj.category.name = obj[k];
                    break;
                }
                case "style": {
                    const val = data.styles.find(c => c.name === obj[k]);
                    console.log("found", val, obj[k]);
                    updObj.style = {};
                    if (val) {
                        updObj.style._id = val._id;
                    } else {
                        updObj.style._id = "new";
                    }
                    updObj.style.name = obj[k];
                    break;
                }
                case "brand": {
                    const val = data.brands.find(c => c.name === obj[k]);
                    console.log("found", val, obj[k]);
                    updObj.brand = {};
                    if (val) {
                        updObj.brand._id = val._id;
                    } else {
                        updObj.brand._id = "new";
                    }
                    updObj.brand.name = obj[k];
                    break;
                }
                case "material": {
                    const val = data.materials.find(c => c.name === obj[k]);
                    console.log("found", val, obj[k]);
                    updObj.material = {};
                    if (val) {
                        updObj.material._id = val._id;
                    } else {
                        updObj.material._id = "new";
                    }
                    updObj.material.name = obj[k];
                    break;
                }
                case "color": {
                    const val = data.colors.find(c => c.name === obj[k]);
                    console.log("found", val, obj[k]);
                    updObj.color = {};
                    if (val) {
                        updObj.color._id = val._id;
                    } else {
                        updObj.color._id = "new";
                    }
                    updObj.color.name = obj[k];
                    break;
                }
                default: {
                    break;
                }
            }
        }
        );
        console.log("updobje after", updObj);
        return updObj;
    },
    findNewAttributesInPreviewModal: () => {
        const newAttr = {}
        Object.keys(data.currentPreviewModal).forEach(k => {
            if (data.currentPreviewModal[k]._id === "new") {
                newAttr[`${k}`] = { ...data.currentPreviewModal[k] };
            }
        })
        return newAttr;
    }
}

const flag = {
    searchWithId: false,
    searchWithAttributes: false,
    categoriesFetched: false,
    stylesFetched: false,
    materialsFetched: false,
    colorsFetched: false,
    brandsFetched: false,
    searchPieceSuccess: false,
}

const pageSettings = {
    language: "italian"
}

const language = {
    italian: {
        nav: {
            pieces: "Vestiti",
            leasing: "Noleggio"
        },
        secNav: {
            findPiece: "Ricerca vestito",
            addPiece: "Aggiungere vestito",
            newLease: "Nuovo noleggio",
            findLease: "Trova noleggio",
            ongoingLeases: "Noleggi in corso",
            calendar: "Calendario"
        },
        findPiecePage: {
            header: "Ricerca vestito",
            category: "Categoria",
            style: "Stile",
            material: "Materiale",
            color: "Colore",
            brand: "Marca"
        },
        addPiecePage: {
            header: "Aggiungere vestito",
            name: "Nome",
            nameInputPlaceholder: "Es. Pantalone dritto",
            description: "Descrizione",
            descriptionInputPlaceholder: "Es. Early Yves Saint Laurent, fragrant, with flower theme.",
            brand: "Marca",
            brandInputPlaceholder: "Es. Fendi",
            category: "Categoria",
            categoryInputPlaceholder: "Es. pantalone",
            style: "Stile",
            styleInputPlaceholder: "Es. sports wear",
            material: "Materiale",
            materialInputPlaceholder: "Es. cachemire.",
            color: "Colore",
            colorInputPlaceholder: "Es. rosso.",
            addBtn: "Aggiunge"
        },
        piecePreviewModal: {
            saveBtn: "Salva capo",
            cancelBtn: "Cancella"
        },
        alert: {
            newAttHeader: "Attenzione",
            newAttText: "I seguenti attributi sono nuovi nel database. Aggiungergli?",
            okBtn: "Ok",
            abortBtn: "Modifica"
        }
    }
}
