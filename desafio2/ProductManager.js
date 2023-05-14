import { promises as fs } from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path;
        this.format = 'utf-8';
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProductCode = await this.generateNewProductCode(products);
        const newProduct = { ...product, id: products.length + 1, code: newProductCode };
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return newProduct;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, this.format);
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si el archivo no existe, se crea un nuevo producto con id 1 y se devuelve en un arreglo
                const newProduct = { id: 1, title: 'Nuevo Producto', description: '', price: 0, thumbnail: '', stock: 0 };
                await fs.writeFile(this.path, JSON.stringify([newProduct], null, '\t'));
                return [newProduct];
            } else {
                throw error;
            }
        }
    }
    

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find((product) => product.id === id);
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const productIndex = products.findIndex((product) => product.id === id);
        if (productIndex === -1) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }
        const updatedProduct = { ...products[productIndex], ...updates };
        products[productIndex] = updatedProduct;
        await fs.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return updatedProduct;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const newProducts = products.filter((product) => product.id !== id);
        if (newProducts.length === products.length) throw new Error(`Producto con id ${id} no encontrado`);
        await fs.writeFile(this.path, JSON.stringify(newProducts, null, '\t'));
    }

    async generateNewProductCode(products) {
        const existingCodes = products.map((product) => product.code);
        let newCode = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const codeLength = 4;
        do {
            newCode = '';
            for (let i = 0; i < codeLength; i++) {
                newCode += characters.charAt(Math.floor(Math.random() * characters.length));
            }
        } while (existingCodes.includes(newCode));
        return newCode;
    }
}

const manager = new ProductManager('user.json');

const newProduct = {
    title: 'Producto A',
    description: 'Este es el producto A',
    price: 9.99,
    thumbnail: 'rutadeimagen.png',
    stock: 10,
};

// agregar nuevo producto
await manager.addProduct(newProduct);

// actualizar el producto con id = 2
await manager.updateProduct(2, { title: 'nombre modificado ', price: 19.99 });

// Borramos el producto con id 2
// manager.deleteProduct(2)
//     .then(() => console.log('Producto borrado correctamente'))
//     .catch((err) => console.log(`Error al borrar producto: ${err.message}`));