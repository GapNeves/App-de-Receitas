import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from './helpers/RenderWithContext';
import App from '../App';

const newDoneRecipes = [
  {
    id: '52771',
    type: 'meal',
    nationality: 'Italian',
    category: 'Vegetarian',
    alcoholicOrNot: '',
    name: 'Spicy Arrabiata Penne',
    image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
    doneDate: '23/06/2020',
    tags: ['Pasta', 'Curry'],
  },
  {
    id: '178319',
    type: 'drink',
    nationality: '',
    category: 'Cocktail',
    alcoholicOrNot: 'Alcoholic',
    name: 'Aquamarine',
    image: 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
    doneDate: '23/06/2020',
    tags: [],
  },
];

describe('DoneRecipes', () => {
  const doneRecipe = '/done-recipes';
  afterEach(() => {
    localStorage.clear();
  });

  it('renderiza a página de Receitas Feitas com os cards de receitas', () => {
    localStorage.setItem('doneRecipes', JSON.stringify(newDoneRecipes));
    renderWithRouterAndContext(<App />, doneRecipe);

    screen.getByText(/italian - vegetarian/i);
    screen.getByText(/alcoholic/i);
  });
  it('Testa Se os botões de filtros funcionam corretamente ', () => {
    localStorage.setItem('doneRecipes', JSON.stringify(newDoneRecipes));
    renderWithRouterAndContext(<App />, doneRecipe);

    const meals = screen.getByRole('button', { name: /meals/i });
    userEvent.click(meals);

    screen.getByRole('img', { name: /spicy arrabiata penne/i });
    expect(screen.queryByText(/alcoholic/i)).not.toBeInTheDocument();

    const drinks = screen.getByRole('button', { name: /drinks/i });
    userEvent.click(drinks);

    screen.getByRole('img', { name: /aquamarine/i });
    expect(screen.queryByText(/italian - vegetarian/i)).not.toBeInTheDocument();

    const all = screen.getByRole('button', { name: /all/i });
    userEvent.click(all);

    screen.getByText(/italian - vegetarian/i);
    screen.getByText(/alcoholic/i);
  });
  it('Testa se o que renderiza caso o localStorage esteja vazio', () => {
    renderWithRouterAndContext(<App />, doneRecipe);

    const horizontalTopText = screen.queryByTestId('0-horizontal-top-text');
    expect(horizontalTopText).not.toBeInTheDocument();
  });
  it('Testa se é redirecionado para telas de detalhes', () => {
    localStorage.setItem('doneRecipes', JSON.stringify(newDoneRecipes));
    const { history } = renderWithRouterAndContext(<App />, doneRecipe);

    const btnRecipeMeals = screen.getByRole('img', { name: /spicy arrabiata penne/i });

    userEvent.click(btnRecipeMeals);

    expect(history.location.pathname).toBe('/meals/52771');
  });
  it('Testa se o botão share exibe uma tag html escrita "Link copied!" ', () => {
    localStorage.setItem('doneRecipes', JSON.stringify(newDoneRecipes));
    renderWithRouterAndContext(<App />, doneRecipe);
    screen.getByTestId('0-horizontal-share-btn');
  });
});
