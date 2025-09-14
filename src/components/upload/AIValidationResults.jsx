import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle, Brain, TrendingUp } from "lucide-react";

const AIValidationResults = ({ validationResults, onAcceptCorrections, onRejectCorrections }) => {
  if (!validationResults) return null;

  const getQualityColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600"; 
    return "text-red-600";
  };

  const getQualityIcon = (score) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  const getComplianceColor = (status) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 border-green-200';
      case 'partial': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'non-compliant': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Quality Assessment Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">AI Data Quality Assessment</h3>
              <p className="text-sm text-slate-600 font-normal">Powered by Google Gemini AI</p>
            </div>
            <div className="ml-auto">
              <div className={`flex items-center gap-2 ${getQualityColor(validationResults.quality_score)}`}>
                {getQualityIcon(validationResults.quality_score)}
                <span className="text-2xl font-bold">{validationResults.quality_score}/100</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 leading-relaxed">{validationResults.overall_assessment}</p>
        </CardContent>
      </Card>

      {/* Standards Compliance */}
      {validationResults.compliance_status && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Standards Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">WHO Standards</span>
                <Badge className={getComplianceColor(validationResults.compliance_status.who_standards)}>
                  {validationResults.compliance_status.who_standards.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">Indian Standards</span>
                <Badge className={getComplianceColor(validationResults.compliance_status.indian_standards)}>
                  {validationResults.compliance_status.indian_standards.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues Found */}
      {validationResults.issues_found?.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              Issues Detected ({validationResults.issues_found.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                The AI system has identified potential data quality issues that require attention.
              </AlertDescription>
            </Alert>
            <ul className="space-y-2">
              {validationResults.issues_found.map((issue, index) => (
                <li key={index} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-red-800 text-sm">{issue}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      {validationResults.recommendations?.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="w-5 h-5" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm font-medium mb-2">
                💡 The AI suggests the following improvements to enhance data quality:
              </p>
            </div>
            <ul className="space-y-2">
              {validationResults.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-800 text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Data Corrections */}
      {validationResults.data_corrections?.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
              Suggested Data Corrections ({validationResults.data_corrections.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-amber-200 bg-amber-50">
              <Brain className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                AI has identified potential data corrections. Review these suggestions carefully before applying.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              {validationResults.data_corrections.map((correction, index) => (
                <div key={index} className="p-4 border border-amber-200 rounded-lg bg-amber-50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-amber-900">{correction.location}</h4>
                    <Badge className={`${
                      correction.confidence === 'high' ? 'bg-green-100 text-green-800' :
                      correction.confidence === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    } border`}>
                      {correction.confidence} confidence
                    </Badge>
                  </div>
                  <p className="text-amber-800 text-sm mb-2">
                    <strong>Issue:</strong> {correction.issue}
                  </p>
                  <p className="text-amber-800 text-sm">
                    <strong>Suggested Value:</strong> {correction.suggested_value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onAcceptCorrections}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Apply AI Corrections
              </button>
              <button
                onClick={onRejectCorrections}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Keep Original Data
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIValidationResults;