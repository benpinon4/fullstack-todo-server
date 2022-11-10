const validateTodoData = (todo) => {


    
    if(todo.title === undefined || typeof(todo.title) !== "string" || todo.title.length < 1){
        return {
            isValid: false,
            message: "You must include a title to your Todo item."
        }
    }
    if(todo.description === undefined || typeof(todo.description) !== "string" || todo.description.length < 1){
        return {
            isValid: false,
            message: "You must include a description to your Todo item."
        }
    }

   
    if(todo.priority !== "Low" && todo.priority !== "Medium" &&  todo.priority !== "High"){
        
        return {
            isValid: false,
            message: "Please select a priority for you todo item."
        }
    }

    return {
        isValid: true,
        
    }

}

module.exports = {
    validateTodoData
}