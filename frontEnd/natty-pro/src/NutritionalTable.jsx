import React, { useState } from 'react';
import axios from 'axios';
import './NutritionalTable.css';

function NutritionalTable() {
    const [name, setName] = useState('');
    const [component, setComponent] = useState('');
    const [minValue, setMinValue] = useState('');
    const [maxValue, setMaxValue] = useState('');
    const [foodData, setFoodData] = useState([]);
    const [componentData, setComponentData] = useState([]);
    const [title, setTitle] = useState('Tabela Nutricional:');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'component':
                setComponent(value);
                break;
            case 'minValue':
                setMinValue(value);
                break;
            case 'maxValue':
                setMaxValue(value);
                break;
            default:
                break;
        }
    };

    const fetchData = async () => {
        try {
            let url = `http://localhost:3001/nutritional-table/`;
            const params = [];
            if (name) {
                params.push(`name=${encodeURIComponent(name)}`);
            }
            if (component) {
                params.push(`component=${encodeURIComponent(component)}`);
            }
            if (minValue) {
                params.push(`minValue=${encodeURIComponent(minValue)}`);
            }
            if (maxValue) {
                params.push(`maxValue=${encodeURIComponent(maxValue)}`);
            }
            if (params.length > 0) {
                url += `?${params.join('&')}`;
            }

            console.log(url);

            const response = await axios.get(url);

            const foodData = response.data.getFood.rows;
            console.log(`foodData`, foodData);

            setTitle(`Resultados da pesquisa para: ${name}`);
            setFoodData([...foodData]);
        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
        }
    };

    const fetchComponentData = async () => {
        try {
            let componentUrl = `http://localhost:3001/nutritional-table/`;
            const componentParams = [];

            if (name) {
                componentParams.push(`name=${encodeURIComponent(name)}`);
            }
            if (component) {
                componentParams.push(`component=${encodeURIComponent(component)}`);
            }
            if (minValue) {
                componentParams.push(`minValue=${encodeURIComponent(minValue)}`);
            }
            if (maxValue) {
                componentParams.push(`maxValue=${encodeURIComponent(maxValue)}`);
            }
            if (componentParams.length > 0) {
                componentUrl += `?${componentParams.join('&')}`;
            }

            const componentResponse = await axios.get(componentUrl);

            const componentData = componentResponse.data.getComponent.rows;

            console.log('componentData', componentData);

            setComponentData([...componentData]);
        } catch (error) {
            console.error('Erro ao buscar os dados da tabela inferior:', error);
        }
    };

    return (
        <div className="nutritional-table">
            <h1 className="nutritional-table-title">{title}</h1>
            <div className="filter-section">
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Filtrar por nome"
                        name="name"
                        value={name}
                        onChange={handleInputChange}
                        className="nutritional-table-input"
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por componente"
                        name="component"
                        value={component}
                        onChange={handleInputChange}
                        className="nutritional-table-input"
                    />
                    <input
                        type="number"
                        placeholder="Valor mínimo (por 100g)"
                        name="minValue"
                        value={minValue}
                        onChange={handleInputChange}
                        className="nutritional-table-input"
                    />
                    <input
                        type="number"
                        placeholder="Valor máximo (por 100g)"
                        name="maxValue"
                        value={maxValue}
                        onChange={handleInputChange}
                        className="nutritional-table-input"
                    />
                    <button onClick={fetchData} className="nutritional-table-button">
                        Buscar Tabela Superior
                    </button>
                    <button onClick={fetchComponentData} className="nutritional-table-button">
                        Buscar Tabela Inferior
                    </button>
                </div>
                <div className="tables">
                    <div className="nutritional-table-container">
                        <table className="nutritional-table-table">
                            <thead>
                                <tr>
                                    <th className="nutritional-table-th">Nome</th>
                                    <th className="nutritional-table-th">Componente</th>
                                    <th className="nutritional-table-th">Valor por 100g</th>
                                </tr>
                            </thead>
                            <tbody>
                                {foodData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="nutritional-table-td">{item[1]}</td>
                                        <td className="nutritional-table-td">{item[2]}</td>
                                        <td className="nutritional-table-td">{item[4]} {item[3]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="nutritional-table-container">
                        <table className="nutritional-table-table">
                            <thead>
                                <tr>
                                    <th className="nutritional-table-th">Código</th>
                                    <th className="nutritional-table-th">Nome</th>
                                    <th className="nutritional-table-th">Componente</th>
                                    <th className="nutritional-table-th">Valor por 100g</th>
                                </tr>
                            </thead>
                            <tbody>
                                {componentData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="nutritional-table-td">{item[1]}</td>
                                        <td className="nutritional-table-td">{item[2]}</td>
                                        <td className="nutritional-table-td">{item[0]}</td>
                                        <td className="nutritional-table-td">{item[4]} {item[3]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NutritionalTable;
