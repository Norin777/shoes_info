const jwt = require("jsonwebtoken");
const Product = require("../models/ProductModel");
const { User } = require("../models/UserModel");

const products = [
    {
        img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9aSTp3Lbjyq5bftdQcdr4BBTLed6qpfmCnA&s",
        name:"Adidas Red Gray",
        description:"can't buy goodbye"
    },
    {
        img:"https://cf.shopee.ph/file/34a98a0fa77954dd5e9c7b419bcc0f34",
        name:"Adidas White",
        description:"can't buy goodbye version 2"
    },
    {
        img:"https://media.istockphoto.com/id/458068097/photo/adidas-superstar.jpg?s=612x612&w=0&k=20&c=cBTSduk5_pPHdQi-Qz_YgJrkceHM4Wk4oDww5O_vwaw=",
        name:"Adidas Black",
        description:"can't buy goodbye version 3"
    }
]
// module.exports.productGet = async function (req, res){
//     let products = await Product.find({isDeleted:false});
//     res.render("products",{page_title:"products",products})
// }
// module.exports.productGet = async function(req, res) {
//     try {
//         // Assuming `req.user` contains the logged-in user's information
//         const userRole = req.user ? req.user.role : null; // Adjust based on your actual setup  
//         let products;
//         if (userRole === "admin") {
//             products = await Product.find();
//         } else {
//             products = await Product.find({ isDeleted: false });
//         }
//         
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).send("Internal Server Error");
//     }
// };

module.exports.productGet = async function (req, res) {
    try {
        let token = req.cookies._token;
    if(!token){
        res.redirect("/login");
        return;
    }
        jwt.verify(token, process.env.Token, async function(err,token){
        // Assuming you have the user ID in req.cookies._token;
       
        // Fetch the user from the database
        let user = await User.findById(token.id);
 
         console.log(user)
 
        // Check the user's role
        const query = user.role === "admin" ? {} : { isDeleted: false };
 
        // Fetch products based on the user's role
        const products = await Product.find(query);
 
        // Render the product page with the fetched products
        res.render("products", { page_title: "Products", products });
        })
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
};


module.exports.productPost = async function (req,res) {
    let name = req.body.name;
    let price = req.body.price;
    let img = req.body.img;
    let description = req.body.description;
    product = new Product({
        name, price, img, description
    })
    try{
        product = await product.save();
        res.status(201).json({
            product
        })
    }catch(err){
        res.json({
            errors:err.message
        })
    }
}

module.exports.addProduct = function(req, res){
    res.render("add-product", {
        page_title:"Add Product"
    })
}

module.exports.searchProduct = async function(req, res){
    let keyword = req.query.keyword;
    if(keyword ===""){
        res.redirect("/products")
        return;
    }
    let products = await Product.find({"name":{"$regex":keyword,"$options":"i"}});
    res.render("partials/selection-selection",{selection: products},(err,html)=>{
        if(err){
            res.status(500).json(
                {
                    "error":"something went wrong"
                }
            )
            return;
        }
        res.status(200).json(
            {
                html
                // products
            }
        )
    })
}

module.exports.productDetail = async function (req, res) {
    let productId = req.query.id;
    let product = await Product.findById(productId);
    res.render("product-detail", { page_title: "Product Detail", product });
};

module.exports.productUpdate = async function(req, res){
    const productId = req.params.id;
    const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        img: req.body.img
    };
    try {
        await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
        res.redirect(`/product-detail?id=${productId}`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
module.exports.productDelete = async function(req, res) {
    const productId = req.params.id;
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.redirect('/products');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.softDelete = async function(req, res){
    let{id} = req.params;
    try{
    await Product.findByIdAndUpdate(id,{isDeleted:true})
    res.status(200).json({
        data:"Delete Successful"
    })
    }
    catch(err){
        res.status(500),json({ error: err.message });
    }
}