const resources = {
    user: {
        create: ['admin'],
        read: ['admin', 'mentor', 'student'],
        read_all: ['admin'],
        update: ['admin'],
        delete: ['admin']
    },

    assessment: {
        create: ['admin', 'mentor'],
        read: ['admin', 'mentor', 'student'],
        update: ['admin'],
        delete: ['admin']
    },

    submission: {
        create: ['admin', 'student'],
        read: ['admin', 'mentor', 'user'],
        update: ['admin'],
        delete: ['admin']
    },

    grade: {
        create: ['admin', 'mentor'],
        read: ['admin'],
        update: ['admin'],
        delete: ['admin']
    },
};

module.exports = (action, resource) => {
    return async (req, res, next) => {
        const role = req.user.role;
        if(resources[resource][action].includes(role)) {
            next();
            return;
        }
        res.status(403).json({msg: "Insufficient permission"});
    };
};
