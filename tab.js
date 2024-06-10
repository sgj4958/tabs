    const tabMenu = (tabNameArray, tabDataArray, insertElementId, option = {}) => {

        const optionDefault = {
            defaultActiveTabIndex: 0,
            background: [],
            tabFullWidth: true,
            fetchEnable: false
        }
        option = {
            ...optionDefault,
            ...option
        }
        
        const tabMenuId = `tabMenu-${Math.floor(Math.random() * 10e5)}`

        const getPromise = (index) => {
            if(option.fetchEnable) tabDataArray[index]()
            .then(result => document.querySelector(`#${tabMenuId} #${tabMenuId}-tabChild .tab:nth-child(${index + 1})`).innerHTML = result)
        }

        document.querySelector(`#${insertElementId}`).insertAdjacentHTML("afterbegin", `
        <article id="${tabMenuId}">
            <section id="${tabMenuId}-tabParent">
                ${tabNameArray.map((e, i) => `<div class="tabWrap ${i == option.defaultActiveTabIndex ? "active" : ""}">${e}</div>`).join("")}
            </section>
            <section id="${tabMenuId}-tabChild">
                ${tabDataArray.map((e, i) => `<div class="tab ${i == option.defaultActiveTabIndex ? "" : "hide"}">${e}</div>`).join("")}
            </section>
        </article>
        `)
        document.head.insertAdjacentHTML("beforeend", `<style>
        #${tabMenuId} * {           
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        #${tabMenuId} #${tabMenuId}-tabParent {
            transform: translateY(1px);
            position: relative;
            z-index: 1;
        }
        #${tabMenuId} .tabWrap {
            float: left;
            border: 1px solid #bbb;
            border-bottom: 0;
            border-radius: 5px 5px 0 0;
            padding: 5px 10px;
            cursor: pointer;
            background: #ddd;
            position: relative;
            z-index: 1;
            transition: background .3s;
            color: #777;
        }
        #${tabMenuId} .tabWrap.active {
            border-bottom: 1px solid #fff;
            color: #333;
            background: #fff
        }
        #${tabMenuId} .tabWrap:not(:last-of-type) {
            margin-right: 5px;
        }
        #${tabMenuId} .tabWrap::after {
            content: "";
            position: absolute;
            width: 0;
            height: 100%;
            left: 0;
            top: 0;
            transition: .3s;
            background: gold;
        }
        #${tabMenuId} .tabWrap:hover::after {
            width: 5px;
        }
        #${tabMenuId} #${tabMenuId}-tabChild {
            width: 100%;
            height: 200px;
            border: 1px solid #bbb;
            background: #fff;
            position: relative;
            overflow: hidden;
        }
        #${tabMenuId} .tab {
            overflow: hidden;
            transition: .3s;
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            padding: 10px;
        }
        #${tabMenuId} .tab.hide {
            transform: translateX(-100%);
        }

            ${option.background.map((e, i) => `#${tabMenuId} .tabWrap:nth-child(${i + 1}).active {background: ${e}; border-bottom: 1px solid ${e};}`).join("")}
            ${option.background.map((e, i) => `#${tabMenuId} .tab:nth-child(${i + 1}) {background: ${e}}`).join("")}
            ${option.background.length ? `#${tabMenuId} .tabWrap {background: #fff}` : ``}
            #${tabMenuId} .tabWrap {width: ${option.tabFullWidth ? `calc((100% - ${(tabNameArray.length - 1) * 5}px) / ${tabNameArray.length})` : ""}}
        </style>`)

        document.querySelectorAll(`#${tabMenuId} #${tabMenuId}-tabParent .tabWrap`).forEach((element, index) => 
            element.addEventListener("click", () => {
                document.querySelectorAll(`#${tabMenuId} #${tabMenuId}-tabParent .tabWrap`).forEach(element => element.classList.remove("active"))
                element.classList.add("active")
                
                document.querySelectorAll(`#${tabMenuId} #${tabMenuId}-tabChild .tab`).forEach(element => element.classList.add("hide"))
                document.querySelector(`#${tabMenuId} #${tabMenuId}-tabChild .tab:nth-child(${index + 1})`).classList.remove("hide")

                getPromise(index)
        }))
        getPromise(option.defaultActiveTabIndex)
    }