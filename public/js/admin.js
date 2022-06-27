const deleteProduct = async (btn) => {
  const id = btn.parentNode.querySelector('[name=id]').value;
  const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value;

  const prodElement = btn.closest('article');

  try {
    const result = await fetch(`/admin/product/${id}`, {
      method: 'DELETE',
      headers: { 'csrf-token': csrfToken },
    });

    prodElement.remove(prodElement);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
