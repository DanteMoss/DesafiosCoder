class ProductManager {
    #counter
    constructor() {
        this.#counter = 1
        this.products = []
    }

    getProducts = () => {
        return this.products;
    }

    //Generar Id
    #Generateid = () => {
        return this.#counter++
    }

    addProduct = (title, description, price, thumbnail, code, stock) => {
        if (!title || !description || !price || !code || !stock) {
            throw new Error('Es obligatorio rellenar todos los campos');
        }

        if (this.products.some(product => product.code === code)) {
            throw new Error('El código del producto ya existe');
        }

        const id = this.#Generateid()
        const object = { id, title, description, price, thumbnail, code, stock }
        this.products.push(object);

        console.log('Producto agregado con éxito:');
        console.log(object);
    }

    getProductById = (id) => {
        const product = this.products.find((p) => p.id === id); //p indica product
        if (product) {
            return product;
        } else {
            console.log("Not found/ ID no encontrado");
            return null;
        }
    }

    getProducts = () => {
        return this.products;
    }
}

const productManager = new ProductManager();
try {
        productManager.addProduct("papa","tuberculo",80,"papa.png",140,1200);
        productManager.addProduct("pera","fruta", 100,"pera.png",141,130);
        productManager.addProduct("banana","fruta",120,"banana.png",142,1000);
        productManager.addProduct("pepino","verdura",200,"pepino.png",145,300);
        productManager.addProduct("carne","carne",500,"carne.png",149,120);
} catch (error) {
    console.error(error.message);
}

//Buscar producto con ID
const product = productManager.getProductById(5);
if (product) {
    console.log(product);
}
