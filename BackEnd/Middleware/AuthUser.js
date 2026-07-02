import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        let token = req.headers.authorization || req.headers.token;

        if (!token) {
            return res.json({
                success: false,
                message: "Not Authorized"
            });
        }

        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1]; 
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        console.log("token_decodedd", token_decode);

        // Attach user info to req object so that other routes can access it
        req.user = token_decode; 

        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.log(error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

export default authUser;
