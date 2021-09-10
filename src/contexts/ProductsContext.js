import axios from 'axios';
import React, { useReducer } from 'react';
import { toast } from 'react-toastify';
import { API } from '../helpers/Const';
export const productsContext = React.createContext()

const INIT_STATE = {
    products: null,
    productToEdit: null
}

const reducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case 'GET_PRODUCTS':
            return { ...state, products: action.payload }
        case 'GET_PRODUCT_TO_EDIT':
            return { ...state, productToEdit: action.payload }
        default:
            return { ...state }

    }
}

const ProductsContextProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, INIT_STATE)


    const addProduct = async (newProduct) => {
        try {
            await axios.post('http://localhost:8000/products', newProduct)
            toast('Успешно создано')
        } catch (e) {
            toast('Ошибка приложения.Попробуйте еще раз')
        }
    }

    const getProducts = async () => {
        const { data } = await axios(API)
        dispatch({
            type: 'GET_PRODUCTS',
            payload: data
        })
    }

    const deleteProduct = async (id) => {
        await axios.delete(`${API}/${id}`)
        getProducts()
    }

    const getProductToEdit = async (id) => {
        const { data } = await axios(`${API}/${id}`)
        dispatch({
            type: 'GET_PRODUCT_TO_EDIT',
            payload: data
        })
    }

    const saveEditedProduct = async (editedProduct) => {
        await axios.patch(`${API}/${editedProduct.id}`, editedProduct)
        getProducts()

    }

    return (
        <div>
            <productsContext.Provider value={{
                products: state.products,
                productToEdit: state.productToEdit,
                addProduct,
                getProducts,
                deleteProduct,
                getProductToEdit,
                saveEditedProduct
            }}>
                {props.children}
            </productsContext.Provider>
        </div>
    );
};

export default ProductsContextProvider;