import { h, Component, render, Fragment } from 'https://unpkg.com/preact@latest?module';
import htm from 'https://unpkg.com/htm?module';
import { useState, useEffect } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';
const html = htm.bind(h);

export {Create, Update}

function getFields(){
    let out = {}
    COLS.forEach(col => {out[col] = col})
    return out
}

function Alert(props){
    return html`
        <div class="alert ${props.type == 1? 
            'alert-success': 'alert-danger'} alert-dismissible fade show" role="alert">
            ${props.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick=${() => props.onDismiss({state: 0, msg: ''})}></button>
        </div>

    `
}

function Create(props){
    const [state, setState] = useState({});
    // alert: 0 -> disable, 1 -> success, 2 -> fail
    const [alert, setAlert] = useState({state: 0, msg: 'test 3'}); 
    let fields = getFields();
    Object.keys(fields).forEach(key => {
        state[key] = ''
    })
    setState(state)

    const onSubmit = ev => {
        console.log('submitting', state)
        ev.preventDefault()
        axios.post('create', state).then(res => {
            console.log(res)
            setState({})
            setAlert({state: 1, msg: `Successfully created ${NAME}`})

        }).catch(err => {
            console.log(err.response)
            setAlert({state: 2, msg: `Error: ${err.response.data.desc}`})
        })
    }
    const onChange = key => {
        return (ev => {
            state[key] = ev.target.value
            setState(state)
        })
    }

    return html`
        <div class="row mt-4">
            <div class="col-3"></div>
            <div class='col-5 '>
                ${alert.state == 0? '' : 
                    html`<${Alert} type=${alert.state} message=${alert.msg}
                        onDismiss=${setAlert}/>`
                }
                <h2>Add ${NAME}</h2>
                <form class="border border-secondary p-4">
                    <div class="mb-3">
                        ${Object.keys(fields).map(key => html`
                            <label class="form-label">${fields[key]} </label>
                            
                            <input type='text' class="form-control" value=${state[key]} onInput=${onChange(key)}/>
                        `)}
                    </div>
                    <button type="submit" onClick=${onSubmit} class="btn btn-primary">Submit</button>
                </form>
            </div>
            <div class="col-3"></div>
        </div>
    `
}

function Update(props){
    let [data, setData] = useState({})
    // alert: 0 -> disable, 1 -> success, 2 -> fail
    const [alert, setAlert] = useState({state: 0, msg: 'test 3'}); 
    let getUserData = () => {
        axios.get(`get/${props.id}`)
            .then(resp => {
                console.log('update data:', resp.data.data)
                setData(resp.data.data)
            }).catch(err => {
                console.log(err.response)
            })
 

    }

    const onSubmit = ev => {
        console.log('submitting', data)
        ev.preventDefault()
        axios.post('update', data).then(res => {
            setAlert({state: 1, msg: `Successfully updated ${NAME}`})
        }).catch(err => {
            console.log(err.response)
            setAlert({state: 2, msg: `Error: ${err.response.data.desc}`})
        })
    }
    const onChange = key => {
        return (ev => {
            data[key] = ev.target.value
            setData(data)
        })
    }

    useEffect(() => {
            getUserData()
    }, [])
    return html`
        <div class="row mt-4">
            <div class="col-3"></div>
            <div class='col-5 '>
                ${alert.state == 0? '' : 
                    html`<${Alert} type=${alert.state} message=${alert.msg}
                        onDismiss=${setAlert}/>`
                }
                <h2>Update ${NAME}</h2>
                <form class="border border-secondary p-4">
                    <div class="mb-3">
                        ${Object.keys(data).filter(key => key != 'id').map(key => html`
                            <label class="form-label">${key} </label>
                            
                            <input type='text' class="form-control" value=${data[key]} onInput=${onChange(key)}/>
                        `)}
                    </div>
                    <button type="submit" onClick=${onSubmit} class="btn btn-primary">Submit</button>
                </form>
            </div>
            <div class="col-3"></div>
        </div>
        
    `
}

function deleteRecord(id){}