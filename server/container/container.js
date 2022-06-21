const fs = require('fs')

class Contenedor {
    constructor(nombreArchivo) {
        this.archivo = nombreArchivo
        this.data = []

        try {
            console.log('Initializing...')
            this.init()
        }
        catch(error) {
            console.log(`Error Initializing ${error}`)
        }
    }

    async init() {
        this.data = await this.getAll()
    }

    async save(objeto) {
        try {
            await this.init()
            objeto = {...objeto, id: this.data.length + 1}
            console.log(this.data)
            this.data.push(objeto)
            await fs.promises.appendFile(this.archivo, '\n'+JSON.stringify(objeto))
            return objeto.id
        }
        catch (error) {
            console.log(error)
        }
    }

    async getAll() {
        try {
            let objetosJSON = await fs.promises.readFile(this.archivo, 'utf-8')
            let objSwap = objetosJSON.split('\n').filter(obj => obj != '')
            let objetos = objSwap.map(obj => JSON.parse(obj))
            return objetos
        }
        catch (error) {
            console.log(error)
        }
    }

    async getById(id) {
        try {
            let productos = await this.getAll()
            let coincidencia = null
            productos.forEach(product => {
                console.log("product", product, "id", id);
                if (Number(product.id) === Number(id)) {
                    coincidencia = product
                }
            })
            return coincidencia
        }
        catch (error) {
            console.log(error)
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.archivo, '')
        }
        catch (error) {
            console.log(error)
        }
    }

    async editById(id, campo, valor) {
        try {
            let productos = await this.getAll();
            const productId = id;
            productos = productos.map(({id, ...producto}) => {
                return parseInt(productId) === parseInt(id) ? {...producto, ...{[campo]: valor}} : producto;
            })
            let parsedData = productos.map((val, index) => {
                return JSON.stringify({...val, id:index+1});
            }).join('\n');
            
           await fs.promises.writeFile(this.archivo, parsedData);
        }
        catch (error) {
            console.log(error)
        }
    }
    async appendDataToFile(path, data) {
  
        // The readFile() method reads the file
        // and returns buffer form of the data 
        const oldBuffer = await fs.promises.readFile(path)
      
        // File content before append 
        const oldContent = oldBuffer.toString()
      
        // Append operation
        await fs.promises.appendFile(path, data)
      
        const newBuffer = await fs.promises.readFile(path)
      
        // File content after append 
        const newContent = newBuffer.toString()
      
        console.log(`Before Append: ${oldContent}\n`)
        console.log(`After Append: ${newContent}`)
    }

    async deleteById(id) {
        try {
            let productos = await this.getAll()
            let productosCargar = productos.filter(obj => obj.id !== id)
            this.deleteAll()
            console.log('productosCargar', productosCargar);
            productosCargar.forEach(async obj =>  {
                await fs.promises.appendFile(this.archivo, JSON.stringify(obj) + '\n')
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    
}

module.exports = Contenedor