exports.roleMiddleware = (...roles) => {
        return (req, res, next) => {
            try {

                if (!req.user || !req.user.role) {
                return res.status(401).json({message: "token mavjut emas!"})
                }

                if (!roles.includes(req.user.role)) {
                    return res.status(403).json({message: "Ruxsat berilmadi!"})
                }

                next()

            } catch (error) {
                res.status(500).send(error)
            }
        }
}