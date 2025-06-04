const permissionMiddleware = (req,res,next) => {
    const userId = parseInt(req.params.id);
    if(req.user.id !== userId){
        return res.status(403).json({ message: 'Permission Denied' });
    }
    next();
}

export default permissionMiddleware