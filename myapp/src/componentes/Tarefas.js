import React, {Component} from "react";

export default class Tarefas extends Component{

    render(){
        const tarefas = ["Acordar", "Tomar café", "Escovar os dentes", "Ir trabalhar"];
        //return <h1>Tarefas</h1>;
        return (
            <ul> 
                { tarefas.map(t => <li>{ t }</li>) }
            </ul>
        );
    }

}