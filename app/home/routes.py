# -*- encoding: utf-8 -*-

import os
from flask import render_template, request,jsonify, url_for
from flask_login import login_required
from jinja2 import TemplateNotFound

from app.home import blueprint
import pandas as pd
import numpy as np
from config import Config

config = Config()
from pathlib import PurePosixPath
pd.set_option("display.float_format", lambda x: "%.5f" % x)  # pandas
pd.set_option("display.max_columns", 100)
pd.set_option("display.max_rows", 100)
pd.set_option("display.width", 600)

# remote_path = PurePosixPath(gcs_path, local_file[1 + len(local_path):])


@blueprint.route('/index')
@login_required
def index():
    return render_template('index.html', segment='index')

@blueprint.route('/overview')
def overview():

    # filepath = r'D:\PROJECTS\645\crunchbase-october-2013\crunchbase-companies.csv'
    filepath_investments = os.path.join(config.datadir,r'crunchbase-investments.zip')

    df_investments = pd.read_csv(r'https://storage.googleapis.com/crunchbase-data-2020-09-18t12-39-18/crunchbase-investments.zip', compression='zip')
    df_investments = df_investments.dropna(subset=['raised_amount_usd'])
    df_investments['raised_amount_usd'] = pd.to_numeric(df_investments['raised_amount_usd'])

    df_category = df_investments.groupby(['company_category_code'])['raised_amount_usd']\
        .sum().reset_index(name='sum_of_category')\
        .sort_values('sum_of_category', ascending=False)\
        .head(15)\
        .sort_values('company_category_code')

    data_list = [row.to_list() for id, row in df_category.iterrows()]

    # filepath_events = r'D:\PROJECTS\645\crunchbase-october-2013\events.csv'

    df_events = pd.read_csv(r'https://storage.googleapis.com/crunchbase-data-2020-09-18t12-39-18/events.csv')
    columns = ['name', 'cb_url', 'started_on', 'city']
    df_events = df_events.T.reindex(columns).T.head(10)
    df_events = df_events.sort_values('started_on',ascending=False)

    # filepath_news = r'D:\PROJECTS\645\boilerplate-code-flask-dashboard\data\news.csv'

    df_news = pd.read_csv(r'https://storage.googleapis.com/crunchbase-data-2020-09-18t12-39-18/news.csv')
    df_news = df_news.sort_values('date',ascending=False).head(15)

    return render_template('page-new.html', segment='overview', data_list=data_list, df_events=df_events.itertuples(), df_news = df_news.itertuples())

@blueprint.route('/industry/<industry>')
@login_required
def industry(industry):
    segment = get_segment(request)

    return render_template('page-industry.html', segment='industry')


@blueprint.route('/<template>')
@login_required
def route_template(template):
    try:

        if not template.endswith('.html'):
            template += '.html'

        # Detect the current page
        segment = get_segment(request)

        # Serve the file (if exists) from app/templates/FILE.html
        return render_template(template, segment=segment)

    except TemplateNotFound:
        return render_template('page-404.html'), 404

    except:
        return render_template('page-500.html'), 500


# Helper - Extract current page name from request
def get_segment(request):
    try:

        segment = request.path.split('/')[-1]

        if segment == '':
            segment = 'index'

        return segment

    except:
        return None
