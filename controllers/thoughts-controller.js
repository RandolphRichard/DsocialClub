const { Thoughts, Users } = require('../models');


const thoughtsController = {

 
    createThoughts({params, body}, res) {
        Thoughts.create(body)
            .then(({_id}) => {
                return Users.findOneAndUpdate({ _id: params.userId}, {$push: {thoughts: _id}}, {new: true});
            })
            .then(dbThoughtsData => {
                if(!dbThoughtsData) {
                    res.status(404).json({message: 'No thoughts with this ID!'});
                    return;
                }
                res.json(dbThoughtsData)
            })
            .catch(err => res.json(err));
    },

    // Get all Thoughts
    getAllThoughts(req,res) {
        Thoughts.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
           
            .then(dbThoughtsData => res.json(dbThoughtsData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // Get a thought with the Id
    getThoughtsById({params}, res) {
        Thoughts.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtsData => {
                if(!dbThoughtsData) {
                    res.status(404).json({message: 'No thoughts with this ID!'});
                    return;
                }
                res.json(dbThoughtsData)
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // Update a thought with the Id
    updateThoughts({params, body}, res) {
        Thoughts.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-___v')
            .then(dbThoughtsData => {
                if (!dbThoughtsData) {
                    res.status(404).json({message: 'No thoughts with this ID!'});
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch(err => res.json(err));
    },

    // Delete a thought with the Id
    deleteThoughts({params}, res) {
        Thoughts.findOneAndDelete({_id: params.id})
            .then(dbThoughtsData => {
                if (!dbThoughtsData) {
                    res.status(404).json({message: 'No thoughts with this ID!'});
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch(err => res.status(400).json(err));
    },

    // Add a new Reaction
    addReaction({params, body}, res) {
        Thoughts.findOneAndUpdate({_id: params.thoughtId}, {$push: {reactions: body}}, {new: true, runValidators: true})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtsData => {
                if (!dbThoughtsData) {
                    res.status(404).json({message: 'No thoughts with this ID!'});
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch(err => res.status(400).json(err))

    },

    // Delete a reaction with the Id
    deleteReaction({params}, res) {
        Thoughts.findOneAndUpdate({_id: params.thoughtId}, {$pull: {reactions: {reactionId: params.reactionId}}}, {new : true})
            .then(dbThoughtsData => {
                if (!dbThoughtsData) {
                    res.status(404).json({message: 'No thoughts with this ID!'});
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch(err => res.status(400).json(err));
    }

};

// Export module thought controller
module.exports = thoughtsController;