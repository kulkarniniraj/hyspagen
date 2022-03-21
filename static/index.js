import { h, Component, render, Fragment } from 'https://unpkg.com/preact@latest?module';
import htm from 'https://unpkg.com/htm?module';
import { useState, useEffect } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';
import {List, Show} from './getinfo.js'
import {Create, Update} from './updateinfo.js'

// Initialize htm with Preact
const html = htm.bind(h);
const COLS = await axios.get('getcols')

function NavBar(props){
    let routes = [NAME + '\'s List', 'Add ' + NAME]
    console.log(props)

    return html `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">${NAME}</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    ${routes.map((route, idx) => html`
                        <li class="nav-item">
                            <a class="nav-link ${idx == props.current? 'active':''}"
                                aria-current="page" href="#" 
                                onClick=${()=>props.onChange(idx)}>${route}</a>
                        </li>
                    
                    `)}
                </ul>
                
            </div>
        </div>
    </nav>
    `
}


function App(props){
    let [appState, setAppState] = useState({routeIdx: 0, id: 0})
    const setRouteIdx = routeIdx => setAppState({
        routeIdx: routeIdx, id: appState.id})

    const setId = id => setAppState({
        routeIdx: appState.routeIdx, id: id})

    const onShow = idx => {
        setAppState({routeIdx: 2, id: idx})
    }

    const onUpdate = idx => {
        setAppState({routeIdx: 3, id: idx})
    }

    const onDelete = (id, fn) => {
        axios.post('delete', {id: id})
        .then(resp => {
            fn()
        })
    }

    let routes = (route) => {
        let rtable = [
            {el: List, props: {onShow: onShow, onUpdate: onUpdate, onDelete: onDelete}}, 
            {el: Create, props: {}},
            {el: Show, props: {id: appState.id}},
            {el: Update, props: {id: appState.id}},
            // List, Create
        ]
        // return {el: rtable[idx], props: {}}
        return rtable[route]
    }
    return html`
        <${NavBar} current=${appState.routeIdx} onChange=${setRouteIdx} />
        <${routes(appState.routeIdx).el} ...${routes(appState.routeIdx).props} />

    `
}

const app = html`<${App}/>`

render(app, document.body);