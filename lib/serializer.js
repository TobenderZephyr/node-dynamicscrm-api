var Serializer = function () {
    function xmlentities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /*
    {
        "Target": {"Id": "... dynamics guid ... ", "LogicalName": "lead"},
        "Assignee": {"Id": "... dymnamics guid ...", "LogicalName": "systemuser"}
    }
    */
    this.toXmlAssign= function(options) {
        var xml = '<b:Parameters>';

        if (options.Target) {
            xml += '<b:KeyValuePairOfstringanyType>';
            xml += '<c:key>Target</c:key>';
            xml += '<c:value i:type="b:EntityReference">';
            xml += '<b:Id>' + options.Target.Id + '</b:Id>';
            xml += '<b:LogicalName>' + options.Target.LogicalName + '</b:LogicalName>';
            xml += '<b:Name i:nil="true" />';
            xml += '</c:value>';
            xml += '</b:KeyValuePairOfstringanyType>';  
        }

        if (options.Assignee) {
            xml += '<b:KeyValuePairOfstringanyType>';
            xml += '<c:key>Assignee</c:key>';
            xml += '<c:value i:type="b:EntityReference">';
            xml += '<b:Id>' + options.Assignee.Id + '</b:Id>';
            xml += '<b:LogicalName>' + options.Assignee.LogicalName + '</b:LogicalName>';
            xml += '<b:Name i:nil="true" />';
            xml += '</c:value>';
            xml += '</b:KeyValuePairOfstringanyType>';

        }

        xml += '</b:Parameters>';
        xml += '<b:RequestId i:nil="true" />';
        xml += '<b:RequestName>Assign</b:RequestName>';

        //console.log('ASSIGN', xml);

        return xml;
    }




    this.toXmlAddToList = function(options) {
        var xml = '<b:Parameters>';

        xml += '<b:KeyValuePairOfstringanyType>';
        xml += '<c:key>ListId</c:key>';
        xml += '<c:value i:type="b:guid" xmlns:d="http://schemas.microsoft.com/2003/10/Serialization/">';
        xml += '4EA85EA9-D866-E311-A406-B4B52F56EDF0';
        xml += '</c:value>';
        xml += '</b:KeyValuePairOfstringanyType>';
        
        xml += '<b:KeyValuePairOfstringanyType>';
        xml += '<c:key>MemberIds</c:key>';
        xml += '<c:value i:type="d:ArrayOfguid" xmlns:d="http://schemas.microsoft.com/2003/10/Serialization/Arrays">';
        xml += '<d:guid>18f6316e-6bbf-e711-811d-5065f38a2b21</d:guid>';
        xml += '</c:value>';
        xml += '</b:KeyValuePairOfstringanyType>';

        xml += '</b:Parameters>';
        xml += '<b:RequestId i:nil="true" />';
        xml += '<b:RequestName>AddListMembersList</b:RequestName>';

        console.log('AddListMembersList', xml);

        return xml;
    }


    /*
    result.EntityName = 'leadsrelation';
    result.EntityId = 'e21a10ec-8209-e111-8660-00155d31e39f';
    result.RelationShip = { PrimaryEntityRole : 'Referencing', SchemaName: 'connectionroleassociation_association'};
    result.RelatedEntities = [
        {
            Id : '29F08E80-4F2B-E111-BD15-00155D31F746',
            LogicalName : 'account',
            Name : 'account'
        }
    ];
    */
    this.toXmlAssociate= function(options) { 
        console.log('toXmlAssociate options', options)
        var xml = '' ;

        if (options.EntityName) {
            xml += "<entityName>"+ options.EntityName +"</entityName>";
        };

        if (options.EntityId) {
            xml += "<entityId>"+ options.EntityId +"</entityId>";
        };

        if (options.RelationShip) {
            if (options.RelationShip.SchemaName) //options.RelationShip.PrimaryEntityRole && //<b:PrimaryEntityRole>"+ options.RelationShip.PrimaryEntityRole + "</b:PrimaryEntityRole>
                {
                    xml += "<relationship><b:SchemaName>" + options.RelationShip.SchemaName +"</b:SchemaName></relationship>";
                }
        };

        if (options.RelatedEntities) {
            var atts = options.RelatedEntities.map(function(c) {
                return '<b:EntityReference><b:Id>'+ c.Id + '</b:Id><b:LogicalName>'+ c.LogicalName +'</b:LogicalName><b:Name>' + c.Name + '</b:Name></b:EntityReference>';
            });
            xml += "<relatedEntities>" + atts.join('') + "</relatedEntities>";
        };

        return xml;
    }    
    /*
    {
        LogicalName : "?",
        Attributes : [ 
            {
                key: "x", 
                value: "y"
            } ],
        FormatedValues : [ 
            {
                key:"x", 
                value:"y"
            } ]
    }
    */
    this.toXmlCreateUpdate= function(options)
    {
        var xml = '' ;
        console.log('OPTIONS', options)
        if (options.Attributes) {
            var atts = options.Attributes.map(function(c) {
                var type = c.type || 'string';
                console.log('TYPE', c, type)
                var ns = c.ns || 'http://www.w3.org/2001/XMLSchema';

                if (type == 'OptionSetValue' || type == 'Money') {
                    var value = '<b:Value>' + xmlentities(c.value) + '</b:Value>';
                } else if (type == 'EntityReference' || type == 'guid') {
                    var value = '<b:Id>' + xmlentities(c.value) + '</b:Id>';
                    if (c.logicalName) {
                        value += '<b:LogicalName>' + xmlentities(c.logicalName) + '</b:LogicalName>';
                    }
                } else {
                    var value = xmlentities(c.value);
                }

                return '<b:KeyValuePairOfstringanyType><c:key>'+ c.key + '</c:key><c:value  i:type="d:' + type + '" xmlns:d="' + ns + '">'+ value +'</c:value></b:KeyValuePairOfstringanyType>';

            });
            xml += "<b:Attributes>" + atts.join('') + "</b:Attributes>";
        };
        if (options.id) {
            xml += "<b:Id>"+ options.id +"</b:Id>";
        };

        if (options.FormatedValues) {
            var atts = options.FormatedValues.map(function(c) {
                return '<c:key>'+ c.key + '</c:key><c:value  i:type="d:string" xmlns:d="http://www.w3.org/2001/XMLSchema">'+ xmlentities(c.value) +'</c:value>';

            });
            xml += "<b:FormattedValues>" + atts.join('') + "</b:FormattedValues>";
        };

        if (options.LogicalName) {
            xml += "<b:LogicalName>"+ options.LogicalName +"</b:LogicalName>";
        };

        //console.log('CREATEUPDATE', xml);

        return xml;
    };

    /*
    {
       EntityName : "?",
       Id : "guid"
    }
    */
    this.toXmlDelete= function(options)
    {
        var xml='' ;
        if (options.EntityName) {
            xml += "<entityName>"+ options.EntityName +"</entityName>";
        };

        if (options.id) {
            xml += "<id>"+ options.id +"</id>";
        };    
        return xml;
    };

    /*
    {
        RequestName : "?",
        RequestId : "guid",
        Parameters : [ 
            {
                key:"x", 
                value:"y"
            } ]
    }
    */
    this.toXmlExecute= function(options)
    {
        var xml='' ;
        
        if (options.RequestName) {
            xml = "<b:RequestName>"+ options.RequestName +"</b:RequestName>";
        };

        if (options.RequestId) {
            xml += "<b:RequestId>"+ options.RequestId +"</b:RequestId>";
        };

        if (options.Parameters) {
            var atts = options.Parameters.map(function(c) {
                return '<b:KeyValuePairOfstringanyType><c:key>'+ c.key + '</c:key><c:value  i:type="d:string" xmlns:d="http://www.w3.org/2001/XMLSchema">'+ xmlentities(c.value) +'</c:value></b:KeyValuePairOfstringanyType>';
            });
            xml += "<b:Parameters>" + atts.join('') + "</b:Parameters>";
        };

        return xml;
    };

    /*
    {
        LogicalName: "lead"
    }
    */
    this.toXmlRetrieveEntity= function(options)
    {
        var entityFilters = options.EntityFilters || 'Entity Attributes Relationships';
        var metadataId = '00000000-0000-0000-0000-000000000000';

        var params = [
            {key: 'EntityFilters', value: entityFilters, type: 'EntityFilters', ns: "http://schemas.microsoft.com/xrm/2011/Metadata"},
            {key: 'MetadataId', value: metadataId, type: 'guid', ns: "http://schemas.microsoft.com/2003/10/Serialization/"},
            {key: 'RetrieveAsIfPublished', value: 'true', type: 'boolean', ns: "http://www.w3.org/2001/XMLSchema"},
            {key: 'LogicalName', value: options.LogicalName, type: 'string', ns: "http://www.w3.org/2001/XMLSchema"}
        ];

        var atts = params.map(function(c) {
            var att = '<b:KeyValuePairOfstringanyType>';
            att += '<c:key>' + c.key + '</c:key>';
            att += '<c:value i:type="d:' + c.type + '" xmlns:d="' + c.ns + '">' + c.value + '</c:value>';
            att += '</b:KeyValuePairOfstringanyType>';
            return att;
        });

        var xml = '<b:Parameters>' + atts.join(' ') + '</b:Parameters>';
        xml += '<b:RequestId i:nil="true" />';
        xml += '<b:RequestName>RetrieveEntity</b:RequestName>';

        return xml;
    }

    this.toXmlRetrieveAttribute = function(options) {
        var entityLogicalName = options.EntityLogicalName;
        var logicalName = options.LogicalName;
        var metadataId = '00000000-0000-0000-0000-000000000000';
        var retrieveAsIfPulished = 'true';

        var params = [
            {key: 'MetadataId', value: metadataId, type: 'guid', ns: "http://schemas.microsoft.com/2003/10/Serialization/"},
            {key: 'RetrieveAsIfPublished', value: 'true', type: 'boolean', ns: "http://www.w3.org/2001/XMLSchema"},
            {key: 'EntityLogicalName', value: options.LogicalName, type: 'string', ns: "http://www.w3.org/2001/XMLSchema"},
            {key: 'LogicalName', value: options.LogicalName, type: 'string', ns: "http://www.w3.org/2001/XMLSchema"}
        ];

        var atts = params.map(function(c) {
            var att = '<b:KeyValuePairOfstringanyType>';
            att += '<c:key>' + c.key + '</c:key>';
            att += '<c:value i:type="d:' + c.type + '" xmlns:d="' + c.ns + '">' + c.value + '</c:value>';
            att += '</b:KeyValuePairOfstringanyType>';
            return att;
        });

        var xml = '<b:Parameters>' + atts.join(' ') + '</b:Parameters>';
        //xml += '<b:RequestId i:nil="true" />';
        xml += '<b:RequestName>RetrieveAttribut</b:RequestName>';

        return xml;
    }

    /* Para asociar y desasociar
    {
        EntityName: "?",
        EntityId: "guid",
        Relationship : 
            { 
                PrimaryEntityRole : "?", 
                SchemaName: "?" 
            },
        RelatedEntities: [ 
            { 
                Id : "guid", 
                LogicalName: "?", 
                Name : "?"  
            } ]
    }
    */
    // this.toXmlAssociate = function(options)
    // {
    //     var xml = '';
    //     console.log('toXmlAssociate options ', options)
    //     if (options.EntityName) {
    //         xml = "<entityName>"+ options.EntityName +"</entityName>";
    //         // xml += "<b:EntityName>"+ options.EntityName +"</b:EntityName>";
    //     };

    //     if (options.EntityId) {
    //         xml += "<entityId>"+ options.EntityId +"</entityId>";
    //         // xml += "<b:entityId>"+ options.EntityId +"</b:entityId>";
    //     };
    //     if (options.Relationship && options.Relationship.SchemaName) {
    //         xml += "<relationship><b:SchemaName>"+ options.Relationship.SchemaName +"</b:SchemaName></relationship>";
    //     };
    //     if (options.RelatedEntities) {
    //         var atts = options.RelatedEntities.map(function(c) { 
    //             return '<b:EntityReference><b:Id>'+ c.Id + '</b:Id><b:LogicalName>'+ c.LogicalName +'</b:LogicalName><b:Name>' + c.Name + '</b:Name></b:EntityReference>';
    //         });
    //         xml += "<relatedEntities>" + atts.join('') + "</relatedEntities>";
    //     };

    //     return xml;
    // };

    this.toXmlRetrieveMultiple = function(options)
    {
        var xml = "";

        if (options.id) {
            xml += "<b:id>" + options.id + "</b:id>";
        };

        if (options.ColumnSet) {
            var columset = options.ColumnSet.map(function (c) {
                return "<c:string>" + c + "</c:string>"
            });

            xml += "<b:ColumnSet><b:AllColumns>false</b:AllColumns><b:Columns xmlns:c=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\">" + columset.join('') + "</b:Columns></b:ColumnSet>";
        } else {
            xml += "<b:ColumnSet><b:AllColumns>true</b:AllColumns><b:Columns/></b:ColumnSet>";
        }

        if (options.Criteria) {
            if (options.Criteria.Conditions) {
                if (options.Criteria.Conditions.FilterOperators) {
                    var filters = options.Criteria.Conditions.FilterOperators.map(function(c){return "<b:FilterOperator>" + c + "</b:FilterOperator>"});
                    xml+="\n<b:Criteria>" + filters.join('') + "</b:Criteria>"
                };
            };
        };

        if (options.ConditionExpression) {
            xml += "\n<b:Criteria><b:Conditions><b:ConditionExpression xmlns:c=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\">"
            xml += "<b:AttributeName>" + options.ConditionExpression.AttributeName + "</b:AttributeName>";
            xml += "<b:Operator>" + options.ConditionExpression.Operator + "</b:Operator>";

            var values = options.ConditionExpression.Values.map(function(c){return "<c:anyType i:type=\"d:" + c.type + "\" xmlns:d=\"http://www.w3.org/2001/XMLSchema\">" + xmlentities(c.value) + "</c:anyType>"});
            xml += "<b:Values>" + values + "</b:Values>";
            xml += "</b:ConditionExpression></b:Conditions></b:Criteria>";
        }

        if (options.EntityName) {
            xml += "<b:EntityName>" + options.EntityName + "</b:EntityName>";
        };

        if (options.Orders) {
            xml += "<b:Orders>"
            for (var i=0; i<options.Orders.length; i++) {
                var o = options.Orders[i];
                xml += "<b:OrderExpression><b:AttributeName>" + o.AttributeName + "</b:AttributeName>";
                xml += "<b:OrderType>" + (o.OrderType || 'Ascending') + "</b:OrderType></b:OrderExpression>";
            }
            xml += "</b:Orders>"
        }

        xml += "<b:Distinct>false</b:Distinct><b:LinkEntities />"

        if (options.TopCount) {
            xml += "<b:TopCount>" + options.TopCount + "</b:TopCount>";
        };

        var pageInfo = options.PageInfo || {};
        pageInfo.Count = pageInfo.Count || 10;
        pageInfo.PageNumber = pageInfo.PageNumber || 1;
        pageInfo.PagingCookie = pageInfo.PagingCookie || null;

        xml += "<b:PageInfo><b:Count>" +
            pageInfo.Count + "</b:Count><b:PageNumber>" +
            pageInfo.PageNumber + "</b:PageNumber>"

        if (pageInfo.PagingCookie === null) {
            xml += "<b:PagingCookie i:nil='true'/>";
        } else {
            xml += "<b:PagingCookie>" + xmlentities(pageInfo.PagingCookie) + "</b:PagingCookie>";
        }
        
        xml += "<b:ReturnTotalRecordCount>false</b:ReturnTotalRecordCount></b:PageInfo>";
        return xml;
    };

    this.toXmlRetrieve= function(options)
    {
        var xml = "";

        if (options.EntityName) {
            xml = "<entityName>"+ options.EntityName +"</entityName>";
        };

        if (options.id) {
            xml += "<id>"+ options.id +"</id>";
        };

        if (options.ColumnSet) {
            var columset = options.ColumnSet.map(function(c){return "<c:string>"+c+"</c:string>"});
            xml += "<columnSet><b:AllColumns>false</b:AllColumns><b:Columns>" + columset.join('') + "</b:Columns></columnSet>";
        } else {
            xml += "<columnSet><b:AllColumns>true</b:AllColumns><b:Columns></b:Columns></columnSet>";
        }

        return xml;
    };
};

module.exports = Serializer;    