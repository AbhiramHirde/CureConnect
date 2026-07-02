import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    try {
        let dToken = req.headers.authorization || req.headers.token;

        if (!dToken) {
            return res.json({
                success: false,
                message: "Not Authorized"
            });
        }

        if (dToken.startsWith('Bearer ')) {
            dToken = dToken.split(' ')[1]; 
        }

        const token_decode = jwt.verify(dToken, process.env.JWT_SECRET);
        //token_decode._id
        req.body.docId = token_decode.id

        console.log("token_decodedd", token_decode);

        // Attach user info to req object so that other routes can access it
        // req.user = token_decode; 

        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.log(error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

export default authDoctor;
