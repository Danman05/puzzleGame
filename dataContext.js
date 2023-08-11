export async function getData() {

    const apiEndpoint = 'https://localhost:7126/api/Superhero';
    const response = await fetch(`${apiEndpoint}`);
    const superheroes = await response.json();

    return superheroes;
}