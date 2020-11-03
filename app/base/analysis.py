
import pandas as pd
import numpy as np
pd.set_option("display.float_format", lambda x: "%.5f" % x)  # pandas
pd.set_option("display.max_columns", 100)
pd.set_option("display.max_rows", 100)
pd.set_option("display.width", 600)

# filepath = r'D:\PROJECTS\645\crunchbase-october-2013\crunchbase-companies.csv'


filepath = r'D:\PROJECTS\645\crunchbase-october-2013\crunchbase-investments.csv'

df = pd.read_csv(filepath)
df = df.dropna(subset=['raised_amount_usd'])
df['raised_amount_usd'] = pd.to_numeric(df['raised_amount_usd'])
df_category_sum = df.groupby(['company_category_code'])['raised_amount_usd'].sum()

grouped['C'].agg([np.sum, np.count_nonzero, np.std])

data_list = []
for id, row in   df_category_sum.iterrows():
    data_list.append(row.to_list())

import json

json_list = json.dumps(data_list)
obj = jQuery.parseJSON(dataSet);

df = pd.DataFrame([('bird', 'Falconiformes', 389.0),
                    ('bird', 'Psittaciformes', 24.0),
                    ('mammal', 'Carnivora', 80.2),
                    ('mammal', 'Primates', np.nan),
                    ('mammal', 'Carnivora', 58)],
                   index=['falcon', 'parrot', 'lion', 'monkey', 'leopard'],
                   columns=('class', 'order', 'max_speed'))

grouped = df.groupby('class')

grouped = df.groupby('order', axis='columns')
grouped = df.groupby(['class', 'order'])

df = pd.read_csv(filepath)
df = df.dropna(subset=['raised_amount_usd'])

df['raised_amount_usd'] = pd.to_numeric(df['raised_amount_usd'])
# df['funded_year'] = pd.to_datetime(df['funded_year'], format='%Y-%m').dt.to_period('M')
df['funded_year'] = pd.to_datetime(df['funded_year'], format='%Y').dt.to_period('Y')

df_category_year = df.groupby(['company_category_code', 'funded_year'])
df_category_year_sum = df_category_year.aggregate(np.sum)
df_category_year_sum['pct_chg'] = df_category_year_sum.groupby(['company_category_code']).pct_change()
df_category_year_sum = df_category_year_sum.reset_index()
df_category_rank = df_category_year_sum[df_category_year_sum['funded_year']=="2013"].sort_values("raised_amount_usd", ascending=False).reset_index(drop=True)
df_category_rank.index.name = "rank"
df_category_rank =  df_category_rank.reset_index()
df_category_rank['rank'] = df_category_rank['rank'].apply(lambda x: x + 1)
df_category_rank_top = df_category_rank[df_category_rank['rank']<20]
df_category_year_sum_top = df_category_year_sum[df_category_year_sum['company_category_code'].isin(df_category_rank_top['company_category_code'].tolist())]
df_category_year_sum_top

df_category_year_sum['raised_amount_usd'] = df_category_year_sum['raised_amount_usd']/1000000

df_category_year_sum.to_csv('raised_amount_usd.csv')

for category, df_group in df_category_year_sum.groupby(['company_category_code']):
    print(df_group)

df_category = df.groupby(['company_category_code'])['raised_amount_usd'].agg([np.sum, np.count_nonzero, np.mean]).rename(columns={'sum': 'sum_raised_amount_usd',
                  'count_nonzero': 'count_raised_amount_usd',
                  'mean': 'avg_raised_amount_usd'})

df_category = df.groupby(['company_category_code'])['raised_amount_usd'].agg([np.sum, np.count_nonzero, np.mean]).rename(columns={'sum': 'sum_raised_amount_usd',
                  'count_nonzero': 'count_raised_amount_usd',
                  'mean': 'avg_raised_amount_usd'})

df_category['number of investments'] = df.groupby(['company_category_code'])['raised_amount_usd'].count().values
df_summary = pd.merge(df_category, df_count, on=df_category.index)

import numpy as np

data_list = [row.to_list() for id, row in df_category.iterrows()]
(grouped['C'].agg([np.sum, np.mean, np.std])
 .rename(columns={'sum': 'foo',
                  'mean': 'bar',
                  'std': 'baz'}))

df_category = df.groupby(['company_category_code'], as_index=False)['raised_amount_usd'].sum().reset_index(name='sum_of_category')
df_category['number of investments'] = df.groupby(['company_category_code'])['raised_amount_usd'].count().values
df_summary = pd.merge(df_category, df_count, on=df_category.index)
df_category_year_sum_top['pct_chg'] = df_category_year_sum_top['pct_chg'] * 100

industry_data = []

for category, df_group in df_category_year_sum_top.groupby(['company_category_code']):
    print(category, df_group)

    if not df_category_rank_top[df_category_rank_top['company_category_code'] == category].empty:
        category_rank = df_category_rank_top[df_category_rank_top['company_category_code'] == category].index[0]
    else:
        category_rank = 9999

    industry_json = {
        "category": category,
        "raised_amoucategorynt_usd": df_group['raised_amount_usd'][-1:].values[0],
        "raised_amount_10yr": df_group['raised_amount_usd'][-10:].tolist(),
        "yoy_pct_chg": df_group['pct_chg'][-1:].values[0],
        "category_rank": category_rank
    }
    industry_data.append(industry_json)

from pprint import pprint

pprint(industry_data)

generatedProductsData = {
    "all": {
        "categories_data": [{
            "x": "Industry",
            "value": 586858,
            "data": industry_data,
        }]
    }
}

generatedProductsData = {
    "all": {
        "categories_data": [{
            "x": "Industry",
            "value": 586858,
            "data": [{
                "x": category,
                "revenue": df_group['raised_amount_usd'][-1:],
                "last": df_group['raised_amount_usd'][-10:],
                "price": df_group['pct_chg'][-1:],
                "average_price": df_category_rank[df_category_rank['company_category_code'] == category].index[0],
            }]
        }]
    }
}


chart_json_entry = {
                    "x": "category_code",
                    "revenue": "last_year",
                    "last": ["annual_rev"],
                    "price": "yoy_pct_chg",
                    "average_price": rank,
                }

