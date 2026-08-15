export function validateProduct(values){const errors={};if(!values.name?.trim())errors.name='Product name is required.';if(!values.category)errors.category='Category is required.';return errors;}
