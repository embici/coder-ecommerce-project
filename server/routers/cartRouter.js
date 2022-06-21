const { Router } = require('express');
const Container = require('../container/container');

const cartContainer = new Container('./db/cart.txt');
const prodContainer = new Container('./db/products.txt');

cartContainer.init();

const router = Router();

router.get('/', (req, res)=>{
    res.send(cartContainer.data)
})

router.post('/', async (req, res)=>{
    try {
        let cartID = await cartContainer.save({products:[]});
        await cartContainer.init();
        await cartContainer.init();

        return res.send({ message: 'Cart successfully created', id: cartID});
    
    } catch (error) {
        throw error
    }

})

router.delete('/:id', async (req, res)=>{
    try{
        const { id } = req.params;    
        await cartContainer.deleteById(Number(id));
        await cartContainer.init();
        res.send({ message: `Cart id: ${id} has been cleared and deleted`})

    }catch(error){
        throw error
    }
})


router.post('/:id/productos', async (req, res)=>{
    try {
        const { id } = req.params;  
        const { product_id, stock } = req.body;
        if(typeof product_id === 'undefined'|| typeof stock === 'undefined'){
            return res.send({ message: 'product_id and stock are required'});
        }
        let currentCart = await cartContainer.getById(id);
        let currentProduct = await prodContainer.getById(product_id);
        await cartContainer.editById(Number(id), "products", [...currentCart.products, ...[{...currentProduct, "stock": stock}]]);
        await cartContainer.init();
    
        return res.send({ message: `Product ${ product_id } successfully added to the Cart ${ id }`})
    
    } catch (error) {
        throw error
    }
})

router.get('/:id/productos', async (req, res)=>{
    try {
        const { id } = req.params;  
        let currentCart = await cartContainer.getById(id);    
        return res.send({ products: currentCart.products || []})
    
    } catch (error) {
        throw error
    }
})

router.delete('/:id/productos/:id_prod', async (req, res)=>{
    try {
        const { id, id_prod } = req.params;  
        let currentCart = await cartContainer.getById(id);
        const newProducts = currentCart.products.filter(product => {
            return Number(product.id) !== Number(id_prod);
        });          
        console.log("newProducts", newProducts);
        await cartContainer.editById(Number(id), "products", newProducts);
        await cartContainer.init();
    
        return res.send({ message: `Product ${ id_prod } successfully removed from the Cart ${ id }`})
    
    } catch (error) {
        throw error
    }
})

module.exports = router;