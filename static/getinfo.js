import { h, Component, render, Fragment } from 'https://unpkg.com/preact@latest?module';
import htm from 'https://unpkg.com/htm?module';
import { useState, useEffect } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';
const html = htm.bind(h);

export {List, Show}

async function getList(){

    return axios.get('/getall')
    // return {keys: ['name', 'phone', 'age'], data: [
    //     {name: 'A', phone: '123', age: 23},
    //     {name: 'B', phone: '423', age: 13},
    // ]}
}

function List(props){
    console.log('called print list')
    let [data, setData] = useState({keys: [], data: []})
    let [del, setDel] = useState(0)
    useEffect(() => {
        getList().then(resp => {
            let a = { data: resp.data.data, keys: [] }
            if (a.data.length > 0) {
                a.keys = Object.keys(a.data[0])
            }
            console.log('get data', a, a.data.length)
            setData(a)
        })
    }, [del])

    return html`
        <div class="row">
            <div class="col-3"></div>
            <div class="col-6 mt-4">
                <h2>Users List</h2>
                <table class="table  table-striped p-3">
                    <thead class="table-dark">
                        <tr>
                            ${data.keys.map(key => html` <th>${key}</th> `)}
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.data.map(row => html`
                            <tr>
                                ${data.keys.map(key => html` <td>${row[key]}</td> `)}
                                <td><button class="btn btn-success btn-sm" onclick=${() => props.onShow(row.id)}>Show</button></td>
                                <td><button class="btn btn-warning btn-sm" onclick=${() => props.onUpdate(row.id)}>Update</button></td>
                                <td><button class="btn btn-danger btn-sm" onclick=${() => props.onDelete(row.id, () => {setDel(1-del)})}>Delete</button></td>
                            </tr>
                        `)}
                    </tbody>
                </table>
            </div>
            <div class="col-3"></div>
        </div>
    `
}

function Show(props){
    console.log('show:', props)
    let [data, setData] = useState({})
    let getUserData = () => {
        axios.get(`/get/${props.id}`)
            .then(resp => {
                console.log('show data:', resp.data.data)
                setData(resp.data.data)
            })

    }
    useEffect(() => {
            getUserData()
    }, [])
    return html`
        <div class="row">
            <div class="col-3"></div>
            <div class="col-6 mt-4 ">
                <h2>User Info</h2>
                <div class="border border-secondary p-2">
                    <table class="table  table-striped p-3">
                        <tbody>
                            ${Object.keys(data).map(key => html`
                                <tr><td>${key}</td><td>${data[key]}</td></tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-3"></div>
        </div>
    `
}