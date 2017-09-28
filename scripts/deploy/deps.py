import json
import os
import sys

def load_configuration():
    configuration_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', '..', 'config', 'production.json')
    if not os.path.isfile(configuration_path):
        print("error: no production configuration found")
        sys.exit(1)

    configuration = None
    with open(configuration_path, 'r') as f:
        configuration = json.loads(f.read())
    if configuration is None or configuration['mail'] is None:
        print("error: configuration is not complete")
        sys.exit(1)

    return configuration

def index_sp_result(result):
    return dict(map(lambda enum: (enum[1]['id'], enum[0]), enumerate(result)))

def verify_templates(sp, configuration):
    existing_templates = sp.templates.list()
    existing_templates_index = index_sp_result(existing_templates)

    desired_templates = configuration['mail']['templates']
    invalid_templates = []
    for template_id in desired_templates.values():
        template_idx = existing_templates_index.get(template_id)
        if template_idx == None:
            invalid_templates.append(template_id)
            continue

        template = existing_templates[template_idx]
        if not template['published']:
            invalid_templates.append(template_id)

    return invalid_templates

def create_lists(sp, configuration):
    existing_lists = sp.recipient_lists.list()
    existing_lists_index = index_sp_result(existing_lists)

    desired_lists = configuration['mail']['lists']
    created_lists = []
    for desired_list in desired_lists.values():
        if existing_lists_index.get(desired_list['id']) is not None:
            continue

        default_recipient = { "address": { "email": "default@example.com" } }
        response = sp.recipient_lists.create(id=desired_list['id'], name=desired_list['name'], recipients=[default_recipient])

        created_lists.append(desired_list['id'])

    return created_lists


from sparkpost import SparkPost
sp = SparkPost()

configuration = load_configuration()

invalid_templates = verify_templates(sp, configuration)
if len(invalid_templates) > 0:
    print("error: the following templates have not been created or published")
    print("\t%s" % '\n\t'.join(invalid_templates))
    sys.exit(1)
else:
    print("info: all templates were verified")

created_lists = create_lists(sp, configuration)
if len(created_lists) > 0:
    num_created = len(created_lists)
    plural = 's' if num_created > 1 else ''
    print("info: created %d new list%s (%s)" % (num_created, plural, ', '.join(created_lists)))
else:
    print("info: no new lists created")
